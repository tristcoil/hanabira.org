# Nix Implementation Notes

## Summary

The Nix support is split into two deliverables:

1. **Development environment** — `nix develop` plus `nix/scripts/*` run the
   whole stack on the host, replacing docker-compose.
2. **Production module** — `nixosModules.hanabira` runs the same stack under
   systemd on NixOS.

Both read the same description of the stack (`nix/services.nix`). That file is
the only place that says what the stack *is*; the dev shell, the shell scripts
and the NixOS module are three adapters over it. Adding a service is one
record in `services.nix` and all three sides follow.

An earlier attempt modeled each service as an ad-hoc "module"
(`nix/modules/*.nix` with callback args such as `stdenv.nodejs-20_x`,
`writeShellScript`, `makeDirectory`) that was never wired into any module
system and could not evaluate. It was removed; services are now either
plain processes managed by the shell scripts (dev) or plain systemd services
(the NixOS module).

## Key design decisions

- **One description, three adapters.** `nix/services.nix` lists the processes
  with their directory, port, command, needs, readiness probe and nginx route.
  The dev shell turns it into packages and environment; `start-all.sh` turns
  it into processes (reading the JSON description the shell exports in
  `HANABIRA_SERVICES_JSON`); the NixOS module turns it into systemd units,
  the nginx vhost and the `services.hanabira` options. Nothing about the
  stack is written down twice, so there is nothing to keep in sync.
- **No service framework.** `nix develop` ships the toolchain and
  `start-all.sh` runs the services like the Dockerfile CMDs do. This mirrors
  the existing deployment model (podman-compose) with the least new code.
- **Nix-managed Python.** The flask backend runs from `nix/python-env.nix`
  (flask, flask-cors, flask-pymongo, pymongo, requests, gunicorn) — no
  virtualenv to create or maintain, and one list for both the shell and the
  module.
- **One readiness check.** `nix/scripts/wait-for-mongo.sh` is the single
  "is MongoDB up" implementation: start-all.sh reaches it through
  `hanabira-lib.sh`, and the module runs it from each service's
  `ExecStartPre`.
- **Idempotent seeding.** `seed-db.sh` checks collection counts with mongosh
  before seeding and skips work that is already done; the JMDict dataset is
  not part of this repository, so dictionary seeding is skipped (with a
  message) when `backend/dictionary/jmdict_json_data_simplified` is absent.
  It is shared verbatim between dev and production (the module's oneshot
  service runs the copy deployed under `/var/lib/hanabira/src`).
- **Project-local runtime state.** MongoDB data, service logs, pid files and
  the generated nginx config live in `.nix/` (git-ignored), never in
  root-owned paths like `/var/log/mongodb`. `.nix/run/` also records the port
  each service actually started on, so a later `status` reports the port an
  earlier `<SERVICE>_PORT=<port> start` chose.
- **Readiness over sleeps.** Services are only started once MongoDB answers
  a ping and each service is polled on its port before the next starts.
- **Port configurability.** All services read their port from the
  environment (one-line patch in `backend/express/my_server.js`:
  `process.env.PORT || 8000`); the stack description holds the defaults and
  both the scripts and the NixOS module expose them as options.
- **Stopping is path-scoped.** pid files for what we started, plus a
  working-directory scan for orphans; never a `pkill -f` pattern that could
  match an unrelated process. The one exception is mongod, which is stopped
  with a graceful shutdown followed by a match on the data directory from
  its own resolved argv.
- **Checks that assert the seams.** `nix flake check` shellchecks the
  scripts, verifies the stack description against the source tree
  (directories, `package.json`s, config templates, unique names/ports/
  routes), runs the description → processes contract test, and asserts that
  the NixOS module generates a unit per process, a location per route and a
  port option per service.
- **Test the contract where it is used.** `nix/scripts/contract-test.sh`
  exercises what the scripts do with the description — port precedence,
  argv substitution, log and route naming, the status/logs surface, the
  guards — without booting anything. It runs in `nix flake check` with the
  tools a dev shell provides, and by hand from `nix develop`, so it is
  covered by the same shellcheck and stays fast.
- **CI covers what `nix flake check` cannot.** `.github/workflows/nix.yml`
  builds the VM's system closure and asserts its shape (unit per service,
  mongodb bound to localhost, the frontend unit installing/building before
  it starts, the vhost routing every prefix), then builds the bootable VM
  image. That is where lazy evaluation mistakes in unit metadata surface:
  `stack.byName "mongod".description` parses as `stack.byName
  ("mongod".description)` and only fails when something forces it, so the
  module check forces every unit's `description` too.

## Files

- `flake.nix` — root flake: `devShells`, `formatter`, `checks`, the NixOS
  module and the test VM configuration
- `nix/services.nix` — the stack, described once (single source of truth)
- `nix/python-env.nix` — flask backend Python environment
- `nix/devshell.nix` — the development shell definition
- `nix/cli.nix` — the `hanabira` command (inside `nix develop`)
- `nix/nixos/module.nix` — `services.hanabira` NixOS module
- `nix/scripts/hanabira-lib.sh` — shared helpers: reads the description,
  probes readiness, pid/cwd helpers
- `nix/scripts/contract-test.sh` — the description → processes contract test
- `nix/scripts/start-all.sh` — full-stack orchestration (start/stop/restart/
  status/logs)
- `nix/scripts/seed-db.sh` — shared, idempotent seeding (dev + production)
- `nix/scripts/wait-for-mongo.sh` — the one MongoDB readiness helper
- `.github/workflows/nix.yml` — CI: checks on every system, formatting, and
  the VM build
- `.gitignore` — ignores `.nix/`, `node_modules/`, `.next/`, `venv/` and the
  generated `backend/dictionary/config.json`

## Known rough edges

- The dev scripts need the dev shell (they read `HANABIRA_SERVICES_JSON` and
  expect mongod/node/gunicorn on PATH); running them from a Nix store copy
  fails loudly with that message instead of operating on the store.
- The VM closure build is deliberately not a `nix flake check` (it is ~GB of
  system closure); CI does it, and locally
  `nixos-rebuild build-vm --flake .#vm` does the same.
- The VM's disk and memory have to be sized for a real deploy: 1 GB starves
  the install, and below 2 GB the kernel OOM-kills `next build`. The flake's
  VM configuration uses 8 GB and 4 GB accordingly.

## What only a boot test can tell you

`nix flake check` evaluates the module, and the VM closure build proves it
assembles, but neither runs the deployed stack. Booting the test VM (locally
with KVM, in CI as a scheduled/dispatch job) caught five bugs that all three
earlier checks passed over:

1. **`nix/scripts` was never deployed.** rsync creates only the last path
   component, so `mkdir ${siteDir}/nix/scripts` failed and the seeding unit
   could never run.
2. **The deployed tree was read-only.** `rsync -a` copies the store's modes,
   leaving every directory at 555, so `npm install` could not create
   `node_modules` ("the operation was rejected by your operating system").
3. **The seeding unit could not find `bash`.** It was executed directly, and
   its shebang (`#!/usr/bin/env bash`) needs bash on the unit's PATH, which
   never contained it; the unit now runs the script through bash explicitly.
4. **The start timeout killed first-boot work.** systemd's 90 s default ends
   `ExecStartPre`, so npm install and `next build` were terminated mid-way
   and the units restarted forever against a partial tree.
5. **The frontend could never build.** The units set `NODE_ENV=production`,
   which makes npm omit devDependencies - where postcss, tailwindcss and
   autoprefixer live - so `next build` failed with
   `Cannot find module 'autoprefixer'`.

Two design rules follow from them: interrupted work must be repairable
(install and build are re-run rather than skipped when a directory merely
exists), and the deployment has to leave the tree writable. Both are covered
by the ci(nix) boot smoke test, which is the check that keeps this honest.
