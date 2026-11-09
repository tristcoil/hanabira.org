# Nix Flake for Hanabira

This directory contains the Nix implementation for Hanabira.org.

## How it fits together

The stack is described once, in [`services.nix`](services.nix): the processes
that make it up, their working directories, ports, commands, readiness
probes, what they need before starting, and how nginx routes to them.
Everything else is an adapter that renders that one description:

```
nix/services.nix          the stack: mongod, dictionary-db, express-db,
                          flask-db, frontend-next, nginx
        │
        ├── nix/devshell.nix        tools + environment for `nix develop`;
        │                           exports the description as JSON in
        │                           HANABIRA_SERVICES_JSON
        │
        ├── nix/scripts/*.sh        render it into processes on this
        │                           machine (start-all.sh, seed-db.sh)
        │
        └── nix/nixos/module.nix    render it into systemd units, the
                                    nginx vhost and the
                                    services.hanabira.* options
```

Adding a service is a change to `services.nix` (one record); the dev shell
PATH, start/stop/status/logs, the systemd unit, the nginx route and the
documented port option all follow. `nix flake check` tests that description:
its paths must exist in the source tree, and the NixOS module must generate
the units, vhost and port options it describes.

```
nix/
  services.nix         # the stack, described once (the single source of truth)
  python-env.nix       # flask backend Python environment (dev shell + module)
  devshell.nix         # `nix develop` environment (all service tooling)
  cli.nix              # `hanabira start|stop|status|logs` (dev shell)
  nixos/
    module.nix         # NixOS module for production deployment
  scripts/
    hanabira-lib.sh    # shared helpers: reads the description, probes, pids
    start-all.sh       # start/stop/restart/status/logs for the whole stack
    seed-db.sh         # idempotent static data seeding (dev + production)
    wait-for-mongo.sh  # the one MongoDB readiness check (scripts + systemd)
```

There is no service module framework: `nix develop` provides the toolchain
(Node.js 22, Python/Flask + gunicorn, MongoDB + mongosh, mecab, nginx) and
`start-all.sh` runs the services on your machine the same way docker-compose
does.

## Development

```bash
nix develop                                # enter the environment
hanabira start                             # MongoDB -> seed -> dictionary -> express -> flask -> frontend -> nginx
hanabira status                            # what is running
hanabira logs frontend                     # tail a service log (-f to follow)
./nix/scripts/seed-db.sh                   # re-run seeding manually (idempotent)
hanabira stop                              # stop everything
```

`hanabira` is a wrapper around `./nix/scripts/start-all.sh`, which works from
inside `nix develop` (it needs the tools on PATH and the stack description the
shell exports). Ports are overridable per service with `<SERVICE>_PORT`, e.g.
`NGINX_PORT=9000 ./nix/scripts/start-all.sh start`.

Then open http://localhost:8888

Runtime state (MongoDB data, logs, pids, generated `nginx.conf`) lives in
`.nix/` at the repository root — delete it to reset everything.

### Per-service manual runs

From inside `nix develop`, each service can also be started directly:

```bash
mongod --dbpath .nix/data/mongodb --port 27017 --fork --logpath .nix/logs/mongod.log
cd backend/dictionary && PORT=5200 node main_server.js
cd backend/express   && PORT=8000 node my_server.js
cd backend/flask     && gunicorn -w 4 -b 0.0.0.0:5100 server:app
cd frontend-next     && PORT=3000 node_modules/.bin/next dev
```

## Production (NixOS)

The flake exposes a NixOS module that runs the whole stack under systemd:

```nix
# configuration.nix
{
  inputs.hanabira.url = "github:<you>/hanabira";

  outputs = { self, hanabira, ... }: {
    nixosConfigurations.production = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        hanabira.nixosModules.hanabira
        {
          services.hanabira = {
            enable = true;
            domain = "hanabira.example.com"; # vhost name ("_" = catch-all)
            enableSSL = true;                 # forceSSL + ACME
            enableNginx = true;               # false: services only, route them yourself
            openFirewall = true;              # open the vhost port
            seedStaticData = true;            # idempotent seeding on every boot
            # ports.nginx / frontend / express / flask / dictionary / mongod
            # are all overridable
          };
          security.acme.acceptTerms = true;
          # MongoDB is SSPL-licensed in nixpkgs:
          nixpkgs.config.allowUnfree = true;
        }
      ];
    };
  };
}
```

What the module does:

- creates the `hanabira` system user and deploys a writable copy of the
  source tree to `/var/lib/hanabira/src` on every activation (`node_modules`
  and a generated `config.json` survive; `.next` is dropped and rebuilt,
  because a build output must match the source it was built from),
- runs one systemd service per service, in dependency order, with MongoDB
  bound to localhost only,
- runs the static-data seeding once per boot as a oneshot service
  (idempotent; the JMDict dataset is not in this repo, so dictionary
  seeding is skipped unless you add `jmdict_json_data_simplified`),
- configures an nginx virtual host proxying `/`, `/e-api/v1/`, `/f-api/v1/`
  and `/d-api/v1/`,
- needs outbound network access (npm registry) on first boot per service,
  for `npm install` / `next build`.

How the stack is exposed (`enableNginx`, on by default):

- `enableNginx = true` (default): nginx routes the whole stack behind one
  host. With `enableSSL = true` it terminates TLS itself (443 + ACME),
  which needs a real domain because a catch-all vhost (`"_"`) has no name to
  request a certificate for.
- `enableNginx = true` + `enableSSL = false`: nginx listens in plain HTTP on
  `ports.nginx`, for a separate TLS terminator (Caddy, an external load
  balancer) to proxy. This is the mode to use when nginx would otherwise
  compete for 443 with that terminator.
- `enableNginx = false`: no nginx at all. The services just listen on their
  own ports with their own path prefixes - route them yourself. Note that
  the module cannot force nginx on a machine where another module sets
  `services.nginx.enable = lib.mkForce false`; in that case this is the mode
  you get, and it works.

In every mode the routes are the same, so whichever layer does the routing
has the same table to mirror: `/` to the frontend, `/e-api/` to express,
`/f-api/` to flask, `/d-api/` to dictionary - prefixes forwarded intact.

Host requirements the first boot makes clear:

- **RAM**: the frontend's production build peaks above 2 GB (a 2 GB test VM
  gets OOM-killed mid-build, leaving a `.next` directory without a
  `BUILD_ID`). Give the host at least 4 GB.
- **Start time**: seeding, both npm installs and the build together take
  several minutes, so the units run with `TimeoutStartSec = 30min` rather
  than systemd's 90 s default - which kills them mid-install and leaves
  them restarting forever.
- **devDependencies**: the services run with `NODE_ENV=production`, under
  which npm omits devDependencies - and the frontend's build toolchain
  (postcss, tailwindcss, autoprefixer) lives there. The install step is run
  with `--include=dev` for that reason.

The module's options and units are generated from `services.nix`; the useful
ones to know:

| Option | Meaning |
| --- | --- |
| `services.hanabira.package` | source tree to deploy (defaults to this flake — point it at another checkout to deploy one) |
| `services.hanabira.ports.<name>` | one per service, defaults from `services.nix` |

Every service that talks to MongoDB (`mongo = true` in `services.nix`) and
the seeding unit get `MONGO_HOST=127.0.0.1` and `MONGO_PORT=<ports.mongod>`
in their environment, because the applications used to hardcode
`localhost:27017` and silently broke wherever mongod runs elsewhere. The
port defaults to 27017, so a default install is unaffected; override it when
you move mongod off that port.

`MONGO_HOST` is `127.0.0.1` and not `localhost` on purpose: Node 18+ resolves
`localhost` to `::1` first, and a mongod bound to the IPv4 loopback is
unreachable from a client that prefers IPv6.

**Deploying from a local checkout.** If your flake pins this repository as a
`path:` input, its lock records a `narHash`, so a later change to the tree is
reused from the store rather than re-read: `nixos-rebuild` then reports
nothing to do while deploying the stale copy. Run
`nix flake update <input-name>` in the deploying flake after changing
anything here.

That same `path:` input also ignores `.gitignore`, so whatever is sitting in
the tree - `frontend-next/.next`, `node_modules`, anything else a build left
behind - is copied into the store and deployed. Build artifacts here are over
half a gigabyte, and a `node_modules` copied from a machine with a different
platform breaks npm. Keep them out of the tree you deploy from; the module
excludes them from the deployment itself, but they still make every
`nix flake update` (and every store copy) pay for them.

**Why the deployment excludes what it excludes.** The flake source is not
always just source, so the deployment must not let it overwrite state this
machine owns: `node_modules` and a generated `config.json` are neither copied
in nor deleted, and `.next` is removed outright so `hanabira-build`
regenerates it. `rsync --filter='P <path>'` alone does *not* do this - it
protects the receiving copy from deletion but still copies the sender's over
it, which is how a developer's local `.next` reached the server and broke a
running site: `next start` reads `.next/static` once at startup and serves
only the asset paths it saw, so a `.next` replaced under a running server
leaves the page asking for assets that server refuses to serve - it renders,
nothing hydrates, and every button is dead. The services also carry
`restartTriggers = [ cfg.package ]`, so a new deployment restarts them instead
of letting a running process outlive its own source.

## Test VM

A bootable VM of the full production stack is included:

```bash
nixos-rebuild build-vm --flake .#vm
./result/bin/run-hanabira-vm   # then open http://localhost:8888 on the VM
```

## Development commands

```bash
nix flake check       # evaluate all outputs; test the stack description and
                      # the generated module; shellcheck the scripts; run the
                      # description → processes contract test
./nix/scripts/contract-test.sh   # that contract test, by hand (fast, no stack)
nix fmt               # format Nix files (nixfmt, RFC style)
```

`nix flake check` runs four kinds of assertion:

1. the scripts shellcheck clean,
2. the stack description references no missing directories, `package.json`
   files or config templates, and its names/ports/routes are unique,
3. the scripts honour what the description says — port precedence
   (override > recorded > description), argv substitution, log and route
   naming, the status/logs surface — without starting anything,
4. the NixOS module generates a systemd unit per process, an nginx location
   per route and a port option per service.

Note: on nix 2.34 the argument-less `nix fmt` used to invoke the formatter
with an empty file list (it read stdin and formatted nothing), so the flake
ships a small wrapper that discovers the repository's Nix files itself and
passes them through when nix does forward some.

## CI

`.github/workflows/nix.yml` runs on pushes and pull requests:

- **validate** — `nix flake show --all-systems` (every output evaluates on
  every declared system), `nix flake check`, and `nix fmt` must be a no-op.
- **vm** — builds the system closure `nixosConfigurations.vm` produces and
  asserts its shape: one systemd unit per service, MongoDB bound to
  localhost with the module's data directory, the frontend unit installing
  and building before it starts, and the nginx vhost routing every API
  prefix. Then builds the bootable VM image, which is what
  `nixos-rebuild build-vm --flake .#vm` and `./result/bin/run-hanabira-vm`
  use locally. This is the job that catches production regressions before
  a deploy.

`nix flake check` runs the meaningful assertions: the stack description
references no missing directories, `package.json` files or config templates;
the NixOS module produces a systemd unit per process, an nginx location per
proxy prefix and a port option per service.

## Notes and gotchas

- **MongoDB comes from `pkgs.mongodb-ce`** (8.3.13, the official prebuilt
  tarball patched for NixOS). Like `pkgs.mongodb` it is unfree (SSPL), so it
  is not on cache.nixos.org and is "built" locally once — but that build only
  downloads the ~150 MB tarball from fastdl.mongodb.org and runs autoPatchelf
  (a few minutes), instead of compiling MongoDB from source for hours. The
  result is cached in `/nix/store` and reused by every later command. The
  application also works with the 8.x MongoDB used by the Dockerfiles.
- The unfree license means the flake opts in narrowly:
  `nixpkgs.config.allowUnfreePredicate = pkg: builtins.elem (lib.getName pkg) [ "mongodb-ce" ]`
  (the NixOS module needs the same on the host, or `allowUnfree = true`).
- **Missing upstream datasets are handled gracefully.** Seeding skips jmdict
  when `backend/dictionary/jmdict_json_data_simplified` is absent (with a
  message), and `main_server.js` logs but continues when
  `backend/dictionary/kanjidic/kanjidic2.json` is missing. Neither file is
  tracked in git; both must be supplied separately if you want those
  endpoints fully functional.
- `mecab` ships with the ipadic dictionary in nixpkgs, so no separate
  dictionary package is needed.
- The express backend listens on `process.env.PORT` with an `8000` default
  (patched in `backend/express/my_server.js`), matching the flake options.
- Flask runs from the flake's Python environment (no `./venv` needed); its
  dependencies live in `nix/python-env.nix`.
- Systemd units are named `hanabira-<service>` and the MongoDB port option is
  `ports.mongod`, both after the names in `services.nix`. (An earlier revision
  of the module called the units `hanabira-express-db` /
  `hanabira-dictionary-db` and the option `ports.mongo`.)
