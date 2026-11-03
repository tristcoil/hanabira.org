#!/usr/bin/env bash
# Start / stop the full Hanabira stack on this machine (docker-compose replacement).
#
# Start order (dependency order):
#   MongoDB -> seed static data -> dictionary-db -> express-db -> flask-db
#   -> frontend-next -> nginx (reverse proxy, serves everything on NGINX_PORT)
#
# Usage:
#   start-all.sh [start|stop|restart|status]
#   start-all.sh logs [service] [-f]
#
# All ports can be overridden via the environment, e.g.:
#   NGINX_PORT=9000 FLASK_PORT=5200 ./start-all.sh start
#
# Runtime state (MongoDB data, logs, pids, generated nginx.conf) lives in
# .nix/ at the repository root and is safe to delete between runs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Ports (mirrors nix/devshell.nix env defaults; express honors $PORT since
# backend/express/my_server.js reads process.env.PORT with an 8000 default)
NGINX_PORT="${NGINX_PORT:-8888}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
EXPRESS_PORT="${EXPRESS_PORT:-8000}"
FLASK_PORT="${FLASK_PORT:-5100}"
DICTIONARY_PORT="${DICTIONARY_PORT:-5200}"
MONGO_PORT="${MONGO_PORT:-27017}"
export NGINX_PORT FRONTEND_PORT EXPRESS_PORT FLASK_PORT DICTIONARY_PORT MONGO_PORT

DATA_ROOT="${HANABIRA_DATA_ROOT:-${ROOT_DIR}/.nix}"
MONGO_DATA_DIR="${DATA_ROOT}/data/mongodb"
LOG_DIR="${DATA_ROOT}/logs"
RUN_DIR="${DATA_ROOT}/run"
NGINX_CONF="${DATA_ROOT}/nginx.conf"

mkdir -p "${MONGO_DATA_DIR}" "${LOG_DIR}" "${RUN_DIR}"

log() {
	echo "[$(date '+%H:%M:%S')] $*"
}

die() {
	echo "[ERROR] $*" >&2
	exit 1
}

mongo_is_up() {
	mongosh --quiet --port "${MONGO_PORT}" --eval "db.runCommand({ ping: 1 })" &>/dev/null
}

is_port_open() {
	curl -s -o /dev/null --max-time 2 "http://127.0.0.1:${1}"
}

wait_for_mongo() {
	for _ in $(seq 1 30); do
		mongo_is_up && return 0
		sleep 1
	done
	return 1
}

wait_for_port() {
	local name="$1" port="$2"
	for _ in $(seq 1 "$3"); do
		if is_port_open "${port}"; then
			log "${name} ready on port ${port}"
			return 0
		fi
		sleep 1
	done
	log "WARNING: ${name} did not answer on port ${port} in time (check '.nix/logs/${name}.log')"
	return 1
}

pid_is_alive() {
	[ -f "${RUN_DIR}/$1.pid" ] && kill -0 "$(cat "${RUN_DIR}/$1.pid" 2>/dev/null)" 2>/dev/null
}

# A port that answers but has no pid file from us is held by a foreign
# process (e.g. code-server on 3000). Say so loudly instead of silently
# treating the service as up.
foreign_port_warning() {
	local name="$1" port="$2" var="$3"
	log "WARNING: ${name}: port ${port} is already in use by a process this script did not start."
	log "         Stop that process, or pick another port: ${var}=<port> ./nix/scripts/start-all.sh start"
}

# Report a service as running (ours), listening (foreign) or stopped.
service_state() {
	local name="$1" port="$2"
	if pid_is_alive "${name}"; then
		echo "running (pid $(cat "${RUN_DIR}/${name}.pid" 2>/dev/null))"
	elif is_port_open "${port}"; then
		echo "listening (not started by this script - port ${port} foreign?)"
	else
		echo "stopped"
	fi
}

# npm install for a service directory on first run (or when node_modules is missing)
ensure_node_modules() {
	local dir="${ROOT_DIR}/$1"
	[ -d "${dir}/node_modules" ] && return 0
	log "installing npm dependencies for $1 (first run, please wait)..."
	(cd "${dir}" && npm install --no-audit --no-fund) >>"${LOG_DIR}/npm-$1.log" 2>&1 || {
		tail -n 20 "${LOG_DIR}/npm-$1.log" >&2
		die "npm install failed for $1 (see ${LOG_DIR}/npm-$1.log)"
	}
}

# backend/dictionary reads config.json (DEEPL/OpenAI keys) at startup
ensure_dictionary_config() {
	local cfg="${ROOT_DIR}/backend/dictionary/config.json"
	[ -f "${cfg}" ] && return 0
	cp "${ROOT_DIR}/backend/dictionary/config.json.dummy" "${cfg}"
	log "created backend/dictionary/config.json from dummy template (add your API keys there)"
}

start_mongodb() {
	if mongo_is_up; then
		log "MongoDB already running on port ${MONGO_PORT}"
		return 0
	fi
	log "starting MongoDB on port ${MONGO_PORT} (data: ${MONGO_DATA_DIR})"
	mongod --dbpath "${MONGO_DATA_DIR}" \
		--bind_ip 127.0.0.1 \
		--port "${MONGO_PORT}" \
		--logpath "${LOG_DIR}/mongod.log" \
		--logappend \
		--fork
	wait_for_mongo || die "MongoDB did not become ready (see ${LOG_DIR}/mongod.log)"
	log "MongoDB ready on port ${MONGO_PORT}"
}

seed_databases() {
	log "seeding static data (skips anything already seeded)..."
	"${SCRIPT_DIR}/seed-db.sh" >>"${LOG_DIR}/seed.log" 2>&1 || {
		tail -n 20 "${LOG_DIR}/seed.log" >&2
		die "seeding failed (see ${LOG_DIR}/seed.log)"
	}
	grep -E '^\[seed' "${LOG_DIR}/seed.log" | tail -n 6 | sed 's/^\[seed //' | while read -r line; do log "seed: ${line}"; done || true
}

start_dictionary() {
	if is_port_open "${DICTIONARY_PORT}"; then
		pid_is_alive dictionary &&
			log "dictionary-db already running on port ${DICTIONARY_PORT}" ||
			foreign_port_warning "dictionary-db" "${DICTIONARY_PORT}" "DICTIONARY_PORT"
		return 0
	fi
	ensure_node_modules backend/dictionary
	ensure_dictionary_config
	log "starting dictionary-db on port ${DICTIONARY_PORT}..."
	(
		cd "${ROOT_DIR}/backend/dictionary" && exec env PORT="${DICTIONARY_PORT}" \
			nohup node main_server.js >>"${LOG_DIR}/dictionary.log" 2>&1 &
		echo $! >"${RUN_DIR}/dictionary.pid"
	)
	wait_for_port dictionary-db "${DICTIONARY_PORT}" 60
}

start_express() {
	if is_port_open "${EXPRESS_PORT}"; then
		pid_is_alive express &&
			log "express-db already running on port ${EXPRESS_PORT}" ||
			foreign_port_warning "express-db" "${EXPRESS_PORT}" "EXPRESS_PORT"
		return 0
	fi
	ensure_node_modules backend/express
	log "starting express-db on port ${EXPRESS_PORT}..."
	(
		cd "${ROOT_DIR}/backend/express" && exec env PORT="${EXPRESS_PORT}" \
			nohup node my_server.js >>"${LOG_DIR}/express.log" 2>&1 &
		echo $! >"${RUN_DIR}/express.pid"
	)
	wait_for_port express-db "${EXPRESS_PORT}" 60
}

start_flask() {
	if is_port_open "${FLASK_PORT}"; then
		pid_is_alive flask &&
			log "flask-db already running on port ${FLASK_PORT}" ||
			foreign_port_warning "flask-db" "${FLASK_PORT}" "FLASK_PORT"
		return 0
	fi
	log "starting flask-db (gunicorn) on port ${FLASK_PORT}..."
	(
		cd "${ROOT_DIR}/backend/flask" && exec env FLASK_PORT="${FLASK_PORT}" \
			nohup gunicorn -w 4 -b "0.0.0.0:${FLASK_PORT}" server:app \
			>>"${LOG_DIR}/flask.log" 2>&1 &
		echo $! >"${RUN_DIR}/flask.pid"
	)
	wait_for_port flask-db "${FLASK_PORT}" 60
}

start_frontend() {
	if is_port_open "${FRONTEND_PORT}"; then
		pid_is_alive frontend &&
			log "frontend already running on port ${FRONTEND_PORT}" ||
			foreign_port_warning "frontend" "${FRONTEND_PORT}" "FRONTEND_PORT"
		return 0
	fi
	ensure_node_modules frontend-next
	log "starting frontend-next (next dev) on port ${FRONTEND_PORT}..."
	(
		cd "${ROOT_DIR}/frontend-next" && exec env PORT="${FRONTEND_PORT}" \
			nohup node_modules/.bin/next dev >>"${LOG_DIR}/frontend.log" 2>&1 &
		echo $! >"${RUN_DIR}/frontend.pid"
	)
	# next dev needs longer to compile on first request
	wait_for_port frontend "${FRONTEND_PORT}" 120
}

generate_nginx_conf() {
	local mime_include=""
	local mime_types
	mime_types="$(dirname "$(readlink -f "$(command -v nginx)")")/../conf/mime.types"
	if [ -f "${mime_types}" ]; then
		mime_include="include ${mime_types};"
	fi
	cat >"${NGINX_CONF}" <<EOF
worker_processes auto;

error_log ${LOG_DIR}/nginx_error.log warn;
pid ${RUN_DIR}/nginx.pid;

events {
    worker_connections 1024;
}

http {
    ${mime_include}
    default_type application/octet-stream;

    access_log ${LOG_DIR}/nginx_access.log;

    # Writable temp/pid paths for a non-root, non-NixOS-service run
    client_body_temp_path ${RUN_DIR}/client_body;
    proxy_temp_path ${RUN_DIR}/proxy;
    fastcgi_temp_path ${RUN_DIR}/fastcgi;
    uwsgi_temp_path ${RUN_DIR}/uwsgi;
    scgi_temp_path ${RUN_DIR}/scgi;

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

        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        location / {
            proxy_pass http://frontend;
        }

        location /e-api/ {
            proxy_pass http://express;
        }

        location /f-api/ {
            proxy_pass http://flask;
        }

        location /d-api/ {
            proxy_pass http://dictionary;
        }
    }
}
EOF
}

start_nginx() {
	if is_port_open "${NGINX_PORT}"; then
		pid_is_alive nginx &&
			log "nginx already listening on port ${NGINX_PORT}" ||
			foreign_port_warning "nginx" "${NGINX_PORT}" "NGINX_PORT"
		return 0
	fi
	generate_nginx_conf
	log "starting nginx on port ${NGINX_PORT} (config: ${NGINX_CONF})"
	# -e keeps startup errors in .nix/logs instead of the unwritable default
	nginx -c "${NGINX_CONF}" -e "${LOG_DIR}/nginx_error.log" || die "nginx failed to start (see ${LOG_DIR}/nginx_error.log)"
	wait_for_port nginx "${NGINX_PORT}" 30
}

start_all() {
	log "starting all services (access http://localhost:${NGINX_PORT})"
	start_mongodb
	seed_databases
	start_dictionary
	start_express
	start_flask
	start_frontend
	start_nginx
	log "all services started"
	log "frontend:  http://localhost:${NGINX_PORT}/"
	log "logs:      ${LOG_DIR}"
}

# Stop a pidfiled service: graceful TERM, then KILL. Only ever kills the exact
# pid the script recorded (never a broad pkill pattern that could match
# unrelated processes on the machine).
stop_by_pidfile() {
	local pidfile="${RUN_DIR}/$1.pid"
	[ -f "${pidfile}" ] || return 0
	local pid
	pid="$(cat "${pidfile}" 2>/dev/null)" || return 0
	[ -n "${pid}" ] || return 0
	kill "${pid}" 2>/dev/null || return 0
	for _ in 1 2 3 4 5; do
		kill -0 "${pid}" 2>/dev/null || break
		sleep 1
	done
	kill -9 "${pid}" 2>/dev/null || true
}

stop_all() {
	log "stopping all services..."

	# nginx: graceful stop via its generated config, then its pid file
	if [ -f "${NGINX_CONF}" ]; then
		nginx -s quit -c "${NGINX_CONF}" 2>/dev/null || true
	fi
	stop_by_pidfile nginx

	# Backends started by this script (pidfiles); path-scoped fallbacks only
	# ever match our own services, never similarly-named foreign processes.
	stop_by_pidfile frontend
	stop_by_pidfile flask
	pkill -f "${ROOT_DIR}/backend/flask" 2>/dev/null || true
	pkill -f "gunicorn -w 4 -b 0.0.0.0:${FLASK_PORT}" 2>/dev/null || true
	stop_by_pidfile express
	pkill -f "${ROOT_DIR}/backend/express" 2>/dev/null || true
	stop_by_pidfile dictionary
	pkill -f "${ROOT_DIR}/backend/dictionary" 2>/dev/null || true
	pkill -f "${ROOT_DIR}/frontend-next" 2>/dev/null || true

	# MongoDB: clean shutdown, then force
	mongosh --quiet --port "${MONGO_PORT}" --eval "db.adminCommand({ shutdown: 1 })" &>/dev/null || true
	sleep 2
	pkill -f "mongod --dbpath ${MONGO_DATA_DIR}" 2>/dev/null || true

	# stale pid files from previous runs
	rm -f "${RUN_DIR}"/*.pid 2>/dev/null || true

	log "all services stopped"
}

status() {
	echo "Hanabira services status:"
	echo "  MongoDB:     $(mongo_is_up && echo "running (port ${MONGO_PORT})" || echo "stopped")"
	echo "  dictionary:  $(service_state dictionary "${DICTIONARY_PORT}")"
	echo "  express:     $(service_state express "${EXPRESS_PORT}")"
	echo "  flask:       $(service_state flask "${FLASK_PORT}")"
	echo "  frontend:    $(service_state frontend "${FRONTEND_PORT}")"
	echo "  nginx:       $(service_state nginx "${NGINX_PORT}")"
}

logs() {
	local follow="" service="all"
	while [ $# -gt 0 ]; do
		case "$1" in
		-f | --follow) follow="1" ;;
		*) service="$1" ;;
		esac
		shift
	done
	case "${service}" in
	mongodb | mongo | mongod) service="mongod" ;;
	dictionary) ;;
	express) ;;
	flask) ;;
	frontend) ;;
	nginx) service="nginx_error" ;;
	all) service="" ;;
	*) die "unknown service '${service}' (mongodb|dictionary|express|flask|frontend|nginx|all)" ;;
	esac

	local files=()
	if [ -n "${service}" ]; then
		files=("${LOG_DIR}/${service}.log")
	else
		files=(
			"${LOG_DIR}/mongod.log"
			"${LOG_DIR}/dictionary.log"
			"${LOG_DIR}/express.log"
			"${LOG_DIR}/flask.log"
			"${LOG_DIR}/frontend.log"
			"${LOG_DIR}/nginx_error.log"
		)
	fi
	local existing=()
	local f
	for f in "${files[@]}"; do
		[ -f "${f}" ] && existing+=("${f}")
	done
	if [ "${#existing[@]}" -eq 0 ]; then
		die "no log files yet in ${LOG_DIR} (start the services first)"
	fi
	if [ -n "${follow}" ]; then
		tail -n 50 -F "${existing[@]}"
	else
		tail -n 50 "${existing[@]}"
	fi
}

main() {
	command -v mongod >/dev/null 2>&1 || die "'mongod' not found - run this from inside 'nix develop'"
	command -v node >/dev/null 2>&1 || die "'node' not found - run this from inside 'nix develop'"
	command -v gunicorn >/dev/null 2>&1 || die "'gunicorn' not found - run this from inside 'nix develop'"

	case "${1:-start}" in
	start) start_all ;;
	stop) stop_all ;;
	restart)
		stop_all
		sleep 2
		start_all
		;;
	status) status ;;
	logs)
		shift
		logs "$@"
		;;
	*) die "usage: $0 {start|stop|restart|status|logs [service] [-f]}" ;;
	esac
}

main "$@"
