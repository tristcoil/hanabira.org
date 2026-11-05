#!/usr/bin/env bash
# Start / stop the full Hanabira stack on this machine (docker-compose
# replacement).
#
# Usage:
#   start-all.sh [start|stop|restart|status]
#   start-all.sh logs [service] [-f]
#
# Start order (dependency order, defined in nix/services.nix):
#   MongoDB -> seed static data -> dictionary-db -> express-db -> flask-db
#   -> frontend-next -> nginx (reverse proxy, serving everything on NGINX_PORT)
#
# What the stack consists of - the services, their ports, working
# directories, commands, readiness probes and nginx routes - is defined
# once, in nix/services.nix. The dev shell hands that description over as
# JSON in HANABIRA_SERVICES_JSON and this script renders it: adding a
# service there is the whole change needed to start, stop, tail and status
# it here.
#
# Ports can be overridden per service with <SERVICE>_PORT, e.g.
#   NGINX_PORT=9000 FLASK_PORT=5200 start-all.sh start
#
# Runtime state (MongoDB data, logs, pids, generated nginx.conf) lives in
# .nix/ (HANABIRA_DATA_ROOT to relocate) and is safe to delete between runs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=hanabira-lib.sh
source "${SCRIPT_DIR}/hanabira-lib.sh"

require_stack

export HANABIRA_LOG_TAG="hanabira"

DATA_ROOT="${HANABIRA_DATA_ROOT:-${ROOT_DIR}/.nix}"
MONGO_DATA_DIR="${DATA_ROOT}/data/mongodb"
LOG_DIR="${DATA_ROOT}/logs"
RUN_DIR="${DATA_ROOT}/run"
NGINX_CONF="${DATA_ROOT}/nginx.conf"
# Ports actually in use are recorded here, so a later `status` sees the port
# an earlier `FRONTEND_PORT=3100 start` chose.
export HANABIRA_PORT_DIR="${RUN_DIR}"
NGINX_PORT="$(stack_port nginx)"

mkdir -p "${MONGO_DATA_DIR}" "${LOG_DIR}" "${RUN_DIR}"

# --- dev runtime state ------------------------------------------------------

pid_file() {
	printf '%s/%s.pid\n' "${RUN_DIR}" "$1"
}

pid_is_alive() {
	local pidfile
	pidfile="$(pid_file "$1")"
	[ -f "${pidfile}" ] && kill -0 "$(cat "${pidfile}" 2>/dev/null)" 2>/dev/null
}

# log_file_of <service>: where its output goes (defaults to <name>.log).
log_file_of() {
	local logname
	logname="$(stack_field "$1" logFile)"
	printf '%s/%s.log\n' "${LOG_DIR}" "${logname:-$1}"
}

# Stop a pidfiled service: graceful TERM, then KILL. Only ever kills the
# exact pid this script recorded, never a broad pattern that could match
# unrelated processes on the machine.
stop_by_pidfile() {
	local pidfile pid
	pidfile="$(pid_file "$1")"
	[ -f "${pidfile}" ] || return 0
	pid="$(cat "${pidfile}" 2>/dev/null)" || return 0
	[ -n "${pid}" ] || return 0
	kill "${pid}" 2>/dev/null || return 0
	for _ in 1 2 3 4 5; do
		kill -0 "${pid}" 2>/dev/null || return 0
		sleep 1
	done
	kill -9 "${pid}" 2>/dev/null || true
}

# A port that answers but has no pid file from us belongs to a foreign
# process (e.g. code-server on 3000). Reports it; the caller fails the start,
# because that port will not serve what the stack would serve on it.
foreign_port_warning() {
	log "WARNING: $1: port $2 is already in use by a process this script did not start."
	log "         Stop that process, or pick another port: $(stack_port_env_var "$1")=<port> start-all.sh start"
	return 0
}

# --- one service at a time --------------------------------------------------

# ARGV (<service>): the dev argv, with {port}/{dataDir}/{logDir} substituted
# by this environment.
resolve_argv() {
	local raw port
	raw="$(stack_jq -r --arg n "$1" 'map(select(.name == $n)) | .[0] | (.devArgv // .argv) | @sh')"
	[ -n "${raw}" ] || die "service '$1' has no argv - it cannot be started here"
	eval "ARGV=(${raw})"
	port="$(stack_port "$1")"
	ARGV=("${ARGV[@]//\{port\}/${port}}")
	ARGV=("${ARGV[@]//\{dataDir\}/${MONGO_DATA_DIR}}")
	ARGV=("${ARGV[@]//\{logDir\}/${LOG_DIR}}")
	ARGV=("${ARGV[@]//\{runDir\}/${RUN_DIR}}")
}

# npm install for a service directory, run every time - the NixOS module does
# the same for the same reason: idempotent and fast off the cache, so it costs
# little when warm, and an install that was interrupted leaves node_modules
# present but incomplete, which a presence check would skip repairing forever.
ensure_node_modules() { # name dir
	local logfile="${LOG_DIR}/npm-$1.log"
	log "installing npm dependencies for $1..."
	(cd "$2" && npm install --prefer-offline --include=dev --no-audit --no-fund) >>"${logfile}" 2>&1 || {
		tail -n 20 "${logfile}" >&2
		die "npm install failed for $1 (see ${logfile})"
	}
}

# Create a config file from its .dummy template when the service declared
# one (backend/dictionary reads DEEPL/OpenAI keys from it at startup).
ensure_config() { # name dir file
	[ -f "$2/$3" ] && return 0
	[ -f "$2/$3.dummy" ] || die "service $1 wants $3, but $2/$3.dummy is missing"
	cp "$2/$3.dummy" "$2/$3"
	log "$1: created $3 from $3.dummy (add your API keys there)"
}

# start_service <name>: returns 0 when running (or already running), 1 when
# it did not become ready in time - start_all reports those at the end.
start_service() {
	local name="$1" port dir timeout
	port="$(stack_port "${name}")"
	dir="$(stack_field "${name}" dir)"
	timeout="$(stack_field "${name}" startupSeconds)"
	timeout="${timeout:-60}"
	[ -n "${dir}" ] && dir="${ROOT_DIR}/${dir}"

	if probe_is_up "${name}"; then
		if pid_is_alive "${name}"; then
			log "${name} already running on port ${port}"
			return 0
		fi
		foreign_port_warning "${name}" "${port}"
		return 1
	fi

	[ -n "${dir}" ] || log "${name} runs outside the source tree (cwd: ${PWD})"
	[ "$(stack_field "${name}" npm)" = "true" ] && ensure_node_modules "${name}" "${dir}"
	local cfg
	cfg="$(stack_field "${name}" config)"
	[ -n "${cfg}" ] && ensure_config "${name}" "${dir}" "${cfg}"

	resolve_argv "${name}"
	log "starting ${name} on port ${port}..."
	(
		if [ -n "${dir}" ]; then
			cd "${dir}" || exit 1
		fi
		exec env "PORT=${port}" "NODE_ENV=development" nohup "${ARGV[@]}" \
			>>"$(log_file_of "${name}")" 2>&1 &
		echo $! >"$(pid_file "${name}")"
	)
	echo "${port}" >"${RUN_DIR}/${name}.port"
	wait_ready "${name}" "${port}" "${timeout}"
}

wait_ready() { # name port seconds
	local name="$1" port="$2" tries="$3"
	for _ in $(seq 1 "${tries}"); do
		if probe_is_up "${name}"; then
			log "${name} ready on port ${port}"
			return 0
		fi
		sleep 1
	done
	log "WARNING: ${name} did not become ready within ${tries}s (see $(log_file_of "${name}"))"
	return 1
}

# --- nginx ------------------------------------------------------------------

# The route table is the stack's `proxy` prefixes, rendered as locations.
# Every prefix maps to a service port, and the URI is forwarded unchanged,
# which is what the backends expect (they serve /e-api/v1/, /f-api/v1/ and
# /d-api/v1/ themselves).
generate_nginx_conf() {
	local locations="" prefix name port mime_include=""
	if [ -n "${HANABIRA_NGINX_MIME_TYPES:-}" ] && [ -f "${HANABIRA_NGINX_MIME_TYPES}" ]; then
		mime_include="include ${HANABIRA_NGINX_MIME_TYPES};"
	fi
	while IFS=$'\t' read -r prefix name; do
		port="$(stack_port "${name}")"
		locations+="        location ${prefix} {
            proxy_pass http://127.0.0.1:${port};
        }
"
	done < <(stack_jq -r 'map(select(.proxy != null)) | .[] | "\(.proxy)\t\(.name)"')

	{
		cat <<EOF
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
EOF
		printf '%s\n' "${locations}"
		cat <<EOF
    }
}
EOF
	} >"${NGINX_CONF}"
}

start_nginx() {
	if probe_is_up nginx; then
		if pid_is_alive nginx; then
			log "nginx already listening on port ${NGINX_PORT}"
			return 0
		fi
		foreign_port_warning nginx "${NGINX_PORT}"
		return 1
	fi
	generate_nginx_conf
	log "starting nginx on port ${NGINX_PORT} (config: ${NGINX_CONF})"
	# -e keeps startup errors in .nix/logs instead of the unwritable default
	nginx -c "${NGINX_CONF}" -e "${LOG_DIR}/nginx_error.log" ||
		die "nginx failed to start (see ${LOG_DIR}/nginx_error.log)"
	wait_ready nginx "${NGINX_PORT}" "$(stack_field nginx startupSeconds)"
}

# --- whole stack ------------------------------------------------------------

seed_databases() {
	log "seeding static data (skips anything already seeded)..."
	"${SCRIPT_DIR}/seed-db.sh" >>"${LOG_DIR}/seed.log" 2>&1 || {
		tail -n 20 "${LOG_DIR}/seed.log" >&2
		die "seeding failed (see ${LOG_DIR}/seed.log)"
	}
	sed -n 's/^\[seed [0-9:]*\] //p' "${LOG_DIR}/seed.log" | tail -n 6 | while read -r line; do
		log "seed: ${line}"
	done
	return 0
}

start_all() {
	log "starting all services (access http://localhost:${NGINX_PORT})"

	local failed=() first name
	# The first process in the stack description is MongoDB; seeding runs
	# between it and the application services.
	first="$(stack_jq -r 'map(select(.argv != null)) | .[0].name')"
	start_service "${first}" || failed+=("${first}")

	seed_databases

	while read -r name; do
		if [ "${name}" = "${first}" ]; then
			continue
		fi
		start_service "${name}" || failed+=("${name}")
	done < <(stack_jq -r 'map(select(.dir != null)) | .[].name')

	start_nginx || failed+=("nginx")

	if [ "${#failed[@]}" -gt 0 ]; then
		log "WARNING: did not start: ${failed[*]}"
		log "check 'start-all.sh status' and ${LOG_DIR}"
		exit 1
	fi

	log "all services started"
	log "frontend:  http://localhost:${NGINX_PORT}/"
	log "logs:      ${LOG_DIR}"
}

stop_service() { # name
	local name="$1" dir pid
	dir="$(stack_field "${name}" dir)"
	[ -n "${dir}" ] && dir="${ROOT_DIR}/${dir}"

	case "${name}" in
	nginx)
		if [ -f "${NGINX_CONF}" ]; then
			nginx -s quit -c "${NGINX_CONF}" 2>/dev/null || true
		fi
		stop_by_pidfile "${name}"
		;;
	mongod)
		resolve_argv "${name}"
		mongo_is_up &&
			mongosh --quiet --port "$(mongo_port)" --eval 'db.adminCommand({ shutdown: 1 })' >/dev/null 2>&1 || true
		sleep 1
		# Any mongod still bound to our data directory (its argv tail comes
		# from the stack description, so it can only ever match ours).
		pkill -f "${ARGV[*]:1}" 2>/dev/null || true
		;;
	*)
		stop_by_pidfile "${name}"
		if [ -n "${dir}" ]; then
			# Orphans: processes still running from this service's
			# directory whose pid file was lost (crashed run, deleted
			# .nix/). Matching by working directory is path-scoped, so it
			# can never hit a similarly named foreign process.
			for pid in $(pids_with_cwd "${dir}"); do
				log "killing orphan ${name} process (pid ${pid})"
				kill "${pid}" 2>/dev/null || true
			done
		fi
		;;
	esac

	rm -f "$(pid_file "${name}")" "${RUN_DIR}/${name}.port"
}

stop_all() {
	log "stopping all services..."
	local name
	# Reverse start order.
	while read -r name; do
		stop_service "${name}"
	done < <(stack_jq -r '[.[].name] | reverse | .[]')
	log "all services stopped"
}

service_state() { # name
	local name="$1" port pidfile
	port="$(stack_port "${name}")"
	pidfile="$(pid_file "${name}")"
	if probe_is_up "${name}"; then
		if [ -f "${pidfile}" ]; then
			echo "running (pid $(cat "${pidfile}" 2>/dev/null), port ${port})"
		elif [ -n "$(stack_field "${name}" dir)" ]; then
			# An application service always leaves its pid file behind when
			# this script starts it.
			echo "listening (not started by this script - port ${port} foreign?)"
		else
			echo "running (port ${port})"
		fi
	else
		echo "stopped"
	fi
}

status() {
	echo "Hanabira services status:"
	local name
	while read -r name; do
		printf '  %-11s %s\n' "${name}" "$(service_state "${name}")"
	done < <(stack_service_names)
	echo "  state:       ${DATA_ROOT}"
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
	mongo | mongodb) service="mongod" ;;
	esac

	local files=() name
	if [ "${service}" = "all" ]; then
		while read -r name; do files+=("$(log_file_of "${name}")"); done < <(stack_service_names)
	else
		while read -r name; do files+=("$(log_file_of "${name}")"); done \
			< <(stack_jq -r --arg s "${service}" 'map(select(.name == $s or (.logFile // .name) == $s)) | .[].name')
		[ "${#files[@]}" -gt 0 ] ||
			die "unknown service '${service}' (mongodb|dictionary|express|flask|frontend|nginx|all)"
	fi

	local existing=() f
	for f in "${files[@]}"; do
		[ -f "${f}" ] && existing+=("${f}")
	done
	[ "${#existing[@]}" -gt 0 ] || die "no log files yet in ${LOG_DIR} (start the services first)"

	if [ -n "${follow}" ]; then
		tail -n 50 -F "${existing[@]}"
	else
		tail -n 50 "${existing[@]}"
	fi
}

main() {
	local tool
	for tool in mongod node npm gunicorn mongosh jq curl; do
		command -v "${tool}" >/dev/null 2>&1 ||
			die "'${tool}' not found - run this from inside 'nix develop'"
	done

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

# Only run when executed: sourcing this file (from the contract check in the
# flake) gives the test the functions above without starting anything.
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
	main "$@"
fi
