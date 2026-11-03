# Nix Flake for Hanabira

This directory contains the Nix implementation for Hanabira.org:

```
nix/
  devshell.nix        # `nix develop` environment (all service tooling)
  nixos/
    module.nix        # NixOS module for production deployment
  scripts/
    start-all.sh      # start/stop/status/logs for the whole stack (dev)
    seed-db.sh        # idempotent static data seeding (dev + production)
    wait-for-mongo.sh # MongoDB readiness check
```

There is no service module framework: `nix develop` provides the toolchain
(Node.js 22, Python/Flask + gunicorn, MongoDB + mongosh, mecab, nginx) and
`nix/scripts/start-all.sh` runs the services on your machine the same way
docker-compose does.

## Development

```bash
nix develop                                # enter the environment
./nix/scripts/start-all.sh start           # MongoDB -> seed -> dictionary -> express -> flask -> frontend -> nginx
./nix/scripts/start-all.sh status          # what is running
./nix/scripts/start-all.sh logs frontend   # tail a service log (-f to follow)
./nix/scripts/seed-db.sh                   # re-run seeding manually (idempotent)
./nix/scripts/start-all.sh stop            # stop everything
```

Then open http://localhost:8888

Runtime state (MongoDB data, logs, pids, generated `nginx.conf`) lives in
`.nix/` at the repository root — delete it to reset everything.

Ports are configurable via environment variables (`NGINX_PORT`,
`FRONTEND_PORT`, `EXPRESS_PORT`, `FLASK_PORT`, `DICTIONARY_PORT`,
`MONGO_PORT`), e.g. `NGINX_PORT=9000 ./nix/scripts/start-all.sh start`.

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
            openFirewall = true;              # open the nginx port
            seedStaticData = true;            # idempotent seeding on every boot
            # ports.nginx / frontend / express / flask / dictionary / mongo
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
  source tree to `/var/lib/hanabira/src` on every activation (npm
  dependencies, `node_modules` and `.next` survive activations),
- runs one systemd service per service, in dependency order, with MongoDB
  bound to localhost only,
- runs the static-data seeding once per boot as a oneshot service
  (idempotent; the JMDict dataset is not in this repo, so dictionary
  seeding is skipped unless you add `jmdict_json_data_simplified`),
- configures an nginx virtual host proxying `/`, `/e-api/v1/`, `/f-api/v1/`
  and `/d-api/v1/`,
- needs outbound network access (npm registry) on first boot per service,
  for `npm install` / `next build`.

## Test VM

A bootable VM of the full production stack is included:

```bash
nixos-rebuild build-vm --flake .#vm
./result/bin/run-hanabira-vm   # then open http://localhost:8888 on the VM
```

## Development commands

```bash
nix flake check       # evaluate all outputs, shellcheck the scripts
nix fmt               # format Nix files (nixfmt-rfc-style)
```

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
- Flask runs from the flake's Python environment (no `./venv` needed).
