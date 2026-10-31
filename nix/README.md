# Nix Flake for Hanabira

This directory contains the Nix flake implementation for Hanabira.org.

## Directory Structure

```
nix/
  flake.nix           # Main flake definition
  modules/            # Individual service modules
    mongodb.nix       # MongoDB service
    frontend-next.nix # Next.js 14 app
    backend/
      express.nix    # Express static DB
      flask.nix      # Flask user DB
      dictionary.nix # Text parser, Japanese NLP
    nginx.nix         # Reverse proxy
    devshell.nix      # Development environment
  scripts/            # Helper scripts
    start-all.sh      # Start all services
    seed-db.sh        # Seed database
    wait-for-mongo.sh # Wait for MongoDB
    config.env        # Environment defaults
```

## Usage

### Development Shell

Enter the development environment:

```bash
nix develop
```

### Start All Services

From within the devshell:

```bash
./nix/scripts/start-all.sh
```

### Stop All Services

```bash
./nix/scripts/start-all.sh stop
```

### Check Service Status

```bash
./nix/scripts/start-all.sh status
```

### Seed Database

```bash
./nix/scripts/seed-db.sh
```

## Configuration

All services are configurable via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| NGINX_PORT | 8888 | Nginx port |
| FRONTEND_PORT | 3000 | Frontend port |
| EXPRESS_PORT | 8000 | Express backend port |
| FLASK_PORT | 5100 | Flask backend port |
| DICTIONARY_PORT | 5200 | Dictionary backend port |
| MONGO_PORT | 27017 | MongoDB port |

## Development Workflow

1. Enter devshell: `nix develop`
2. Start services: `./nix/scripts/start-all.sh`
3. Access Hanabira at http://localhost:8888
4. Edit files as needed
5. Services auto-restart on changes (except MongoDB)

## Service Dependency Order

Services are started in the following order:

1. MongoDB
2. Dictionary DB
3. Express DB
4. Flask DB
5. Frontend
6. Nginx (as reverse proxy)