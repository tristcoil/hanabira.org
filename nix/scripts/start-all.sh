#!/bin/bash
# Start all Hanabira services with proper dependency order
# Usage: start-all.sh [options]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="${SCRIPT_DIR}/.."

# Source config
source "${SCRIPT_DIR}/config.env" 2>/dev/null || true

# Default ports
NGINX_PORT="${NGINX_PORT:-8888}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
EXPRESS_PORT="${EXPRESS_PORT:-8000}"
FLASK_PORT="${FLASK_PORT:-5100}"
DICTIONARY_PORT="${DICTIONARY_PORT:-5200}"
MONGO_PORT="${MONGO_PORT:-27017}"

# PID files
PID_DIR="/tmp/hanabira"
mkdir -p "${PID_DIR}"

log() {
	echo "[$(date '+%H:%M:%S')] $*"
}

wait_for_service() {
	local name="$1"
	local port="$2"
	local max_attempts="${3:-30}"

	log "Waiting for ${name} on port ${port}..."
	for i in $(seq 1 "${max_attempts}"); do
		if curl -s "http://localhost:${port}" &>/dev/null; then
			log "${name} is ready"
			return 0
		fi
		sleep 1
	done
	log "ERROR: ${name} not ready after ${max_attempts} seconds"
	return 1
}

start_mongodb() {
	log "Starting MongoDB..."
	mongod --dbpath /tmp/mongodb \
		--bind_ip_all \
		--fork \
		--logpath /var/log/mongodb/mongod.log \
		--port "${MONGO_PORT}"
	wait_for_service "MongoDB" "${MONGO_PORT}"
}

start_dictionary() {
	log "Starting Dictionary DB..."
	cd "${BASE_DIR}/backend/dictionary"

	# Ensure MongoDB is running
	pgrep -q mongod || start_mongodb

	# Seed if needed
	if ! mongosh --port "${MONGO_PORT}" --eval "db.adminCommand('ping')" &>/dev/null; then
		log "Waiting for MongoDB..."
		sleep 5
	fi

	# Seed database
	node seed_jmdict_data.js

	# Start server
	node main_server.js &
	echo $! >"${PID_DIR}/dictionary.pid"

	# Wait for it to be ready
	sleep 3
	wait_for_service "Dictionary DB" "${DICTIONARY_PORT}"
}

start_express() {
	log "Starting Express DB..."
	cd "${BASE_DIR}/backend/express"

	# Ensure MongoDB is running
	pgrep -q mongod || start_mongodb

	# Seed if needed
	sleep 3

	# Start server
	node my_server.js &
	echo $! >"${PID_DIR}/express.pid"

	# Wait for it to be ready
	sleep 3
	wait_for_service "Express DB" "${EXPRESS_PORT}"
}

start_flask() {
	log "Starting Flask DB..."
	cd "${BASE_DIR}/backend/flask"

	# Ensure MongoDB is running
	pgrep -q mongod || start_mongodb

	# Start server
	./venv/bin/gunicorn -w 4 -b 0.0.0.0:${FLASK_PORT} server:app &
	echo $! >"${PID_DIR}/flask.pid"

	# Wait for it to be ready
	sleep 3
	wait_for_service "Flask DB" "${FLASK_PORT}"
}

start_frontend() {
	log "Starting Frontend..."
	cd "${BASE_DIR}/frontend-next"

	# Build if needed
	if [ ! -d .next ]; then
		npm run build
	fi

	# Start server
	npm run dev &
	echo $! >"${PID_DIR}/frontend.pid"

	# Wait for it to be ready
	sleep 10
	wait_for_service "Frontend" "${FRONTEND_PORT}"
}

start_nginx() {
	log "Starting Nginx..."
	mkdir -p /tmp

	# Generate nginx config
	cat >/tmp/nginx.conf <<EOF
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include mime.types;
    default_type application/octet-stream;
    
    access_log /tmp/nginx_access.log;
    error_log /tmp/nginx_error.log;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    upstream frontend {
        server 127.0.0.1:${FRONTEND_PORT};
    }
    
    upstream express {
        server 127.0.0.1:${EXPRESS_PORT};
    }
    
    upstream flask {
        server 127.0.0.1:${FLASK_PORT};
    }
    
    upstream dictionary {
        server 127.0.0.1:${DICTIONARY_PORT};
    }
    
    server {
        listen ${NGINX_PORT};
        server_name localhost;
        
        proxy_connect_timeout 60;
        proxy_read_timeout 60;
        proxy_send_timeout 60;
        
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
        
        location /e-api/ {
            proxy_pass http://express;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
        
        location /f-api/ {
            proxy_pass http://flask;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
        
        location /d-api/ {
            proxy_pass http://dictionary;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
    }
}
EOF

	# Start nginx
	nginx -c /tmp/nginx.conf
	sleep 2
	wait_for_service "Nginx" "${NGINX_PORT}"
}

stop_all() {
	log "Stopping all services..."

	# Stop Nginx
	nginx -s stop 2>/dev/null || true

	# Stop frontends
	pkill -f "next dev" 2>/dev/null || true

	# Stop backends
	pkill -f "my_server.js" 2>/dev/null || true
	pkill -f "gunicorn" 2>/dev/null || true
	pkill -f "main_server.js" 2>/dev/null || true

	# Stop MongoDB
	pkill -f "mongod" 2>/dev/null || true

	# Clean up PID files
	rm -f "${PID_DIR}"/*.pid 2>/dev/null || true

	log "All services stopped"
}

status() {
	echo "Hanabira services status:"
	echo "========================="

	echo -n "MongoDB: "
	pgrep -q mongod && echo "running" || echo "stopped"

	echo -n "Frontend: "
	pgrep -q "next dev" && echo "running" || echo "stopped"

	echo -n "Express: "
	pgrep -q "my_server.js" && echo "running" || echo "stopped"

	echo -n "Flask: "
	pgrep -q "gunicorn" && echo "running" || echo "stopped"

	echo -n "Dictionary: "
	pgrep -q "main_server.js" && echo "running" || echo "stopped"

	echo -n "Nginx: "
	pgrep -q nginx && echo "running" || echo "stopped"
}

# Main
case "${1:-start}" in
start)
	# Check if already running
	pgrep -q nginx && log "Nginx already running" || start_nginx
	pgrep -q "next dev" && log "Frontend already running" || start_frontend
	pgrep -q "my_server.js" && log "Express already running" || start_express
	pgrep -q "gunicorn" && log "Flask already running" || start_flask
	pgrep -q "main_server.js" && log "Dictionary already running" || start_dictionary

	log "All services started successfully"
	log "Access Hanabira at http://localhost:${NGINX_PORT}"
	;;
stop)
	stop_all
	;;
restart)
	stop_all
	sleep 2
	start_mongodb
	start_dictionary
	start_express
	start_flask
	start_frontend
	start_nginx
	log "All services restarted"
	;;
status)
	status
	;;
*)
	echo "Usage: $0 {start|stop|restart|status}"
	exit 1
	;;
esac
