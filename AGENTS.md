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

### Nix Development Shell (Recommended)

The repository includes a Nix flake for native development without Docker:

```bash
# Enter development environment
nix develop

# Start all services
./nix/scripts/start-all.sh

# Stop all services
./nix/scripts/start-all.sh stop

# Check status
./nix/scripts/start-all.sh status

# Seed database
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
- Use `./nix/scripts/start-all.sh` to start all services with proper dependency order
- Use `./nix/scripts/seed-db.sh` to seed the database
- Use `./nix/scripts/wait-for-mongo.sh` to wait for MongoDB readiness

## Testing

No automated tests exist in the repo. Test manually via API endpoints documented in `dev_notes.txt` files.

## Deploy to Production

1. Run Ansible playbook: `ansible-playbook -i inventory_file.yml server_setup_playbook.yml`
2. Copy `nginx.conf` to `/etc/nginx/sites-enabled/`
3. Run `certbot --nginx` for Let's Encrypt certificate
4. Deploy with `podman-compose -f docker-compose_prod.yml up -d`

## Nix Development Notes

The `nix/` directory contains the Nix flake implementation:

- **nix/flake.nix**: Main flake definition
- **nix/modules/**: Individual service modules (mongodb, nginx, etc.)
- **nix/scripts/**: Helper scripts for service orchestration