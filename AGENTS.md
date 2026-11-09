# Hanabira.org - Agent Guide

## Architecture

This is a monorepo with 4 backend services and 1 frontend:

| Service | Port | Tech Stack | Purpose |
|---------|------|------------|---------|
| frontend-next | 3000 | Next.js 14, React 18, Tailwind | Main web application |
| express-db (Express) | 8000 | Node.js, Express, MongoDB | Static dictionary DB (kanji, vocabulary, grammar, reading) |
| flask-dynamic-db (Flask) | 5100 | Python Flask, MongoDB | User-specific data (flashcards, streak, library) |
| dictionary-db (Node.js) | 5200 | Node.js, Express, MongoDB | Text parser, Japanese NLP (mecab, kuroshiro, jmdict, jpmame) |
| nginx | 8888 (host) | Nginx | Reverse proxy to all backends |

All services communicate via HTTP on these API endpoints:

- `/e-api/v1/*` → express-db:8000 (static DB)
- `/f-api/v1/*` → flask-dynamic-db:5100 (user-specific DB)
- `/d-api/v1/*` → dictionary-db:5200 (text parsing, Japanese NLP)
- `/` → frontend-next:3000

## Development Setup

### Nix Development (Recommended)

The repository includes a Nix flake for native development without Docker.
`nix develop` provides all tooling (Node.js 22, Python/Flask + gunicorn,
MongoDB + mongosh, mecab, nginx); services are orchestrated by
`./nix/scripts/start-all.sh`:

```bash
# Enter development environment
nix develop

# Start all services
./nix/scripts/start-all.sh

# Stop all services
./nix/scripts/start-all.sh stop

# Check status
./nix/scripts/start-all.sh status

# Seed static data (idempotent, also runs automatically during start)
./nix/scripts/seed-db.sh
```

Access Hanabira at http://localhost:8888

### Manual Local Development
1. Start MongoDB on port 27017
2. Seed static DB data (see `backend/dictionary/dev_notes.txt`):
   ```bash
   cd backend/dictionary
   node seed_jmdict_data.js
   ```
3. Run each service:
   ```bash
   # Frontend
   cd frontend-next && npm run dev

   # Express static DB
   cd backend/express && node my_server.js

   # Flask user DB
   cd backend/flask && python3 server.py

   # Dictionary text parser
   cd backend/dictionary && node main_server.js
   ```

## Text Parsing & Japanese NLP

The system uses multiple Japanese text analyzers:

| Tool | Port | Purpose |
|------|------|---------|
| mecab | system | Morphological tokenizer (requires apt install) |
| kuroshiro | Node.js | Furigana/Japanese character conversion |
| jmdict | Node.js | Dictionary lookup |
| jamdict | Python | Extended dictionary with form explanations |

### Text parsing API (dictionary-db:5200)

```bash
# Split text into tokens with dictionary lookup
curl -X POST http://localhost:5200/d-api/v1/parse-simple \
  -H "Content-Type: application/json" \
  -d '{"text": "彼女は完全遅不了。"}'
```

## Key File Locations

| Path | Purpose |
|------|---------|
| `frontend-next/` | Next.js 14 app |
| `backend/express/` | Static dictionary DB (Node.js) |
| `backend/flask/` | User-specific data (Flask) |
| `backend/dictionary/` | Text parser, Japanese NLP (Node.js) |
| `CICD/ansible/` | Production deployment (Ansible) |
| `nginx.conf` | Nginx reverse proxy config |
| `nix/` | Nix flake for development environment |

## Important Gotchas

- **Database ports**: MongoDB must run on port 27017 (hardcoded in `backend/dictionary/server.js`)
- **Environment variables**: `REACT_APP_HOST_IP` must point to backend service name (e.g., `express-db` for Docker)
- **Config files**: `config_dummy.json` contains DEEPL and OpenAI API keys (not in git)
- **Audio files**: Not included in repo; must be generated separately
- **Production uses Podman**: Ansible script deploys with `podman-compose` instead to Docker
- **Database names**: FlashcardDB (user data) vs sourceDB (static kanji/vocabulary/grammar/reading)

## Nix Development

- Use `nix develop` to enter the development environment
- All dependencies (MongoDB, mecab, Node.js, Python) are pre-configured
- Use `hanabira start` (or `./nix/scripts/start-all.sh start`) to start all services with proper dependency order
- Use `hanabira stop`, `hanabira status`, `hanabira logs [service] [-f]` to manage and inspect the running stack
- Use `./nix/scripts/seed-db.sh` to seed the database (idempotent; runs as part of `start`)
- Use `./nix/scripts/wait-for-mongo.sh` to wait for MongoDB readiness (also runs as each service's `ExecStartPre` in production)
- Runtime state (MongoDB data, logs, pids, ports, nginx.conf) lives in `.nix/` and is safe to delete
- Ports are configurable per service with `<SERVICE>_PORT=<port>` (e.g. `FRONTEND_PORT=3100 hanabira start`); `<SERVICE>_PORT` also feeds `status`, `stop` and the generated nginx config
- Scripts must run from inside `nix develop` (they read the stack description the shell exports in `HANABIRA_SERVICES_JSON`)

## Testing

No automated tests exist in the repo. Test manually via API endpoints documented in `dev_notes.txt` files.
`nix flake check` evaluates all flake outputs, shellchecks the orchestration scripts, runs the
description → processes contract test (`nix/scripts/contract-test.sh`), checks that the stack description in
`nix/services.nix` matches the source tree, and asserts that the NixOS module generates the systemd units,
nginx vhost and port options it describes. CI (`.github/workflows/nix.yml`) additionally builds the test VM's
system closure and asserts its shape.

## Deploy to Production

1. Run Ansible playbook: `ansible-playbook -i inventory_file.yml server_setup_playbook.yml`
2. Copy `nginx.conf` to `/etc/nginx/sites-enabled/`
3. Run `certbot --nginx` for Let's Encrypt certificate
4. Deploy with `podman-compose -f docker-compose_prod.yml up -d`

On a NixOS machine, deployment can instead use the flake's NixOS module
(`hanabira.nixosModules.hanabira`) — see `nix/README.md` for details.

## Nix Development Notes

The `nix/` directory contains the Nix implementation:

- **nix/services.nix**: the stack described once — processes, ports, directories, commands, nginx routes (the single source of truth)
- **nix/devshell.nix**: `nix develop` development environment (all service tooling, plus the `hanabira` command)
- **nix/python-env.nix**: Python environment for the flask backend (shared by the shell and the module)
- **nix/nixos/module.nix**: `services.hanabira` NixOS module for production (systemd services + nginx vhost), generated from `nix/services.nix`
- **nix/scripts/**: Helper scripts for service orchestration and seeding (they render `nix/services.nix` from `HANABIRA_SERVICES_JSON`; `hanabira-lib.sh` is their shared plumbing)
- The root `flake.nix` wires everything together and provides a test VM (`nixos-rebuild build-vm --flake .#vm`)
- See `nix/README.md` for the architecture and `nix/IMPLEMENTATION_NOTES.md` for the design decisions