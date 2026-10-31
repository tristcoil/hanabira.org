{
  lib,
  stdenv,
  writeShellScript,
  makeFile,
}:

{
  ports,
  enableBuildCache ? true,
}:
{
  name = "hanabira-dev";
  version = "0.1.0";

  # Packages for development
  packages = [
    # Node.js (frontend and backend)
    stdenv.nodejs-20_x
    stdenv.npm
    stdenv.autoreconfHook

    # MongoDB
    stdenv.mongodb

    # mecab (Japanese text tokenizer)
    stdenv.mecab
    stdenv.libmecab-dev

    # Python
    stdenv.python3
    stdenv.python3Packages.flask
    stdenv.python3Packages.flask-cors
    stdenv.python3Packages.flask-pymongo
    stdenv.python3Packages.requests
    stdenv.python3Packages.pymongo

    # Nginx
    stdenv.nginx

    # Utilities
    stdenv.curl
    stdenv.git
    stdenv.coreutils

    # Frontend build tools
    stdenv.autoPatchelfHook
    stdenv.cac
    stdenv.cac-heap
    stdenv.cac-malloc
    stdenv.cac-thread
  ];

  # Environment variables
  env = {
    MONGODB_PORT = toString ports.mongo;
    EXPRESS_PORT = toString ports.express;
    FLASK_PORT = toString ports.flask;
    DICTIONARY_PORT = toString ports.dictionary;
    NGINX_PORT = toString ports.nginx;
    NODE_ENV = "development";
  };

  # Startup script
  startScript = writeShellScript "start-hanabira" ''
    #!/bin/bash
    set -euo pipefail

    echo "Starting Hanabira development environment..."

    # Start MongoDB if not running
    if ! pgrep -q mongod; then
      mkdir -p /tmp/mongodb
      mongod --dbpath /tmp/mongodb \
             --bind_ip_all \
             --fork \
             --logpath /var/log/mongodb/mongod.log \
             --port ${toString ports.mongo}
      echo "Waiting for MongoDB to start..."
      sleep 5
    fi

    # Start Dictionary DB
    echo "Starting Dictionary DB..."
    cd ${stdenv.cwd}/backend/dictionary
    node seed_jmdict_data.js &
    node main_server.js &
    echo "Dictionary DB started on port ${toString ports.dictionary}"

    # Start Express DB
    echo "Starting Express DB..."
    cd ${stdenv.cwd}/backend/express
    node my_server.js &
    echo "Express DB started on port ${toString ports.express}"

    # Start Flask DB
    echo "Starting Flask DB..."
    cd ${stdenv.cwd}/backend/flask
    ./venv/bin/gunicorn -w 4 -b 0.0.0.0:${toString ports.flask} server:app &
    echo "Flask DB started on port ${toString ports.flask}"

    # Start Frontend
    echo "Starting Frontend..."
    cd ${stdenv.cwd}/frontend-next
    npm run dev &
    echo "Frontend started on port ${toString ports.frontend}"

    # Start Nginx
    echo "Starting Nginx..."
    mkdir -p /tmp
    cat > /tmp/nginx.conf << 'EOF'
    worker_processes auto;

    events {
        worker_connections 1024;
    }

    http {
        include mime.types;
        default_type application/octet-stream;
        
        access_log /tmp/nginx_access.log;
        error_log /tmp/nginx_error.log;
        
        upstream frontend {
            server 127.0.0.1:${toString ports.frontend};
        }
        
        upstream express {
            server 127.0.0.1:${toString ports.express};
        }
        
        upstream flask {
            server 127.0.0.1:${toString ports.flask};
        }
        
        upstream dictionary {
            server 127.0.0.1:${toString ports.dictionary};
        }
        
        server {
            listen ${toString ports.nginx};
            server_name localhost;
            
            location / {
                proxy_pass http://frontend;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
            
            location /e-api/ {
                proxy_pass http://express;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
            
            location /f-api/ {
                proxy_pass http://flask;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
            
            location /d-api/ {
                proxy_pass http://dictionary;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
        }
    }
    EOF

    nginx -c /tmp/nginx.conf
    echo "Nginx started on port ${toString ports.nginx}"

    echo "All services started successfully!"
    echo "Access Hanabira at http://localhost:${toString ports.nginx}"
  '';

  # Stop script
  stopScript = writeShellScript "stop-hanabira" ''
    #!/bin/bash
    set -euo pipefail

    echo "Stopping Hanabira services..."

    # Stop Nginx
    nginx -s stop 2>/dev/null || true

    # Stop services
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "my_server.js" 2>/dev/null || true
    pkill -f "gunicorn" 2>/dev/null || true
    pkill -f "main_server.js" 2>/dev/null || true
    pkill -f "mongod" 2>/dev/null || true

    echo "All services stopped"
  '';

  # Ready script
  readyScript = writeShellScript "check-hanabira-ready" ''
    #!/bin/bash
    set -euo pipefail

    # Check all services
    curl -s http://localhost:${toString ports.nginx} &>/dev/null
  '';
}
