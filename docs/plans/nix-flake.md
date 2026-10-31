# Plan: Nix Flake for Hanabira

## Implementation Goals

- All services run natively (no Docker/Podman)
- Single entrypoint via Nginx on port 8888
- MongoDB included but configurable
- Services start in proper order: MongoDB → Dictionary → Express → Flask → Frontend
- Static Next.js build served via Nginx from `.next/`

## Configuration Answers

| Question | Answer |
|----------|--------|
| Frontend serving | Static build, served via Nginx from `.next/` |
| MongoDB port | Configurable via env var (default 27017) |
| Frontend port | 3000 (configurable) |
| Backend ports | 8000/5100/5200 (configurable) |
| Nginx proxy | Yes, port 8888 |
| Individual backend ports exposed | Configurable |
| Frontend build cache | Configurable (preserve `.next/` between runs) |
| Database seeding | Auto-seed on first start |

## Final File Structure

```
nix/
  flake.nix
  modules/
    mongodb.nix              # MongoDB service, configurable port
    frontend-next.nix        # Next.js 14 with static build
    backend/
      express.nix           # Express static DB
      flask.nix             # Flask user DB
      dictionary.nix        # Text parser with Japanese NLP
    nginx.nix               # Reverse proxy to all services
    services.nix            # Orchestrator for service startup order
  devshell.nix            # Development environment
  overlays/
    prod.nix              # Production flags (if needed)
  scripts/
    start.sh              # Service orchestration
    seed-db.sh            # Database seeding script
    wait-for-mongo.sh     # Wait script for service dependencies
```

## Key Design Decisions

1. **Nginx port 8888**: Primary entrypoint, proxies to all backends
2. **Static frontend build**: `npm run build` → Nginx serves from `.next/`
3. **Configurable ports**: All services read port from env vars with defaults
4. **MongoDB: portable**:
   - Uses `/tmp/mongodb` by default
   - Data directory configurable via `MONGODB_DATA_DIR`
   - Port configurable via `MONGODB_PORT`
   - Auto-creates `/data/db` if not exists
5. **Service startup order**:
   - Start MongoDB → wait for readiness
   - Start Dictionary (w/ seed) → wait for readiness
   - Start Express → wait for readiness
   - Start Flask → wait for readiness
   - Start Frontend (built) → start Nginx
6. **No container system**: All services run directly via `nix develop`

## Implementation Steps

1. Create `nix/` directory structure
2. Implement `modules/mongodb.nix` with configurable port
3. Implement `modules/backend/dictionary.nix` with mecab
4. Implement `modules/backend/express.nix`
5. Implement `modules/backend/flask.nix`
6. Implement `modules/frontend-next.nix` with static build
7. Implement `modules/nginx.nix` with proxy config
8. Implement `modules/services.nix` orchestrator
9. Create `devshell.nix` with `nix develop` support
10. Add config via Nix inputs + env vars

## Implementation Progress

- [x] Step 1: Create `nix/` directory structure
- [x] Step 2: Implement `modules/mongodb.nix`
- [x] Step 3: Implement `modules/backend/dictionary.nix`
- [x] Step 4: Implement `modules/backend/express.nix`
- [x] Step 5: Implement `modules/backend/flask.nix`
- [x] Step 6: Implement `modules/frontend-next.nix`
- [x] Step 7: Implement `modules/nginx.nix`
- [x] Step 8: Create `nix/scripts/` with start-all.sh, wait-for-mongo.sh, config.env, seed-db.sh
- [x] Step 9: Create `nix/modules/devshell.nix`
- [x] Step 10: Add configuration via Nix inputs + env vars

## Files Created

```
nix/
  flake.nix                           # Main flake definition
  modules/
    config.nix                        # Port configuration
    mongodb.nix                       # MongoDB service
    frontend-next.nix                 # Next.js 14 with static build
    devshell.nix                      # Development environment
    backend/
      express.nix                    # Express static DB
      flask.nix                      # Flask user DB
      dictionary.nix                 # Text parser with Japanese NLP
    nginx.nix                         # Reverse proxy to all services
  scripts/
    start-all.sh                      # Service orchestration
    seed-db.sh                        # Database seeding script
    wait-for-mongo.sh                 # Wait script for service dependencies
    config.env                        # Environment variable defaults
```