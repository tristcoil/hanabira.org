# Nix Implementation Notes

## Summary

The Nix support is split into two deliverables:

1. **Development environment** — `nix develop` plus `nix/scripts/*` run the
   whole stack on the host, replacing docker-compose.
2. **Production module** — `nixosModules.hanabira` runs the same stack under
   systemd on NixOS.

An earlier attempt modeled each service as an ad-hoc "module"
(`nix/modules/*.nix` with callback args such as `stdenv.nodejs-20_x`,
`writeShellScript`, `makeDirectory`) that was never wired into any module
system and could not evaluate. It was removed; services are now either
plain processes managed by the shell scripts (dev) or plain systemd services
(the NixOS module).

## Key design decisions

- **No service framework.** `nix develop` ships the toolchain and
  `start-all.sh` runs the services like the Dockerfile CMDs do. This mirrors
  the existing deployment model (podman-compose) with the least new code.
- **Nix-managed Python.** The flask backend runs from
  `python3.withPackages (flask, flask-cors, flask-pymongo, pymongo, requests,
  gunicorn)` — no virtualenv to create or maintain.
- **meCab from nixpkgs.** `pkgs.mecab` bundles the ipadic dictionary, so the
  mecab binary (spawned by the `mecab-async` npm package) works out of the
  box. No external dictionary downloads.
- **Idempotent seeding.** `seed-db.sh` checks collection counts with mongosh
  before seeding and skips work that is already done; the JMDict dataset is
  not part of this repository, so dictionary seeding is skipped (with a
  message) when `backend/dictionary/jmdict_json_data_simplified` is absent.
- **Project-local runtime state.** MongoDB data, service logs, pid files and
  the generated nginx config live in `.nix/` (git-ignored), never in
  root-owned paths like `/var/log/mongodb`.
- **Readiness over sleeps.** Services are only started once MongoDB answers
  a ping and each service is polled on its port before the next starts.
- **Port configurability.** All services read their port from the
  environment (one-line patch in `backend/express/my_server.js`:
  `process.env.PORT || 8000`); the devshell exports the defaults and both
  the scripts and the NixOS module expose them as options.

## Files

- `flake.nix` — root flake: `devShells`, `formatter`, `checks`, the NixOS
  module and the test VM configuration
- `nix/devshell.nix` — the development shell definition
- `nix/nixos/module.nix` — `services.hanabira` NixOS module
- `nix/scripts/start-all.sh` — full-stack orchestration (start/stop/restart/
  status/logs)
- `nix/scripts/seed-db.sh` — shared, idempotent seeding (dev + production)
- `nix/scripts/wait-for-mongo.sh` — MongoDB readiness helper
- `.gitignore` — ignores `.nix/`, `node_modules/`, `.next/`, `venv/` and the
  generated `backend/dictionary/config.json`
