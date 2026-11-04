#!/usr/bin/env bash
# Contract test for the stack description → processes seam.
#
# Exercises what start-all.sh and hanabira-lib.sh do with the description in
# nix/services.nix - port precedence, argv substitution, log and route naming,
# the status/logs surface, the guards - without starting any service.
#
# Run it by hand from inside `nix develop` (HANABIRA_SERVICES_JSON is already
# exported there), or from anywhere with that variable pointing at the JSON.
# `nix flake check` runs it as checks.script-contract.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

fail() {
	echo "contract: FAIL: $*" >&2
	exit 1
}

require_stack() {
	[ -n "${HANABIRA_SERVICES_JSON:-}" ] ||
		die_like "HANABIRA_SERVICES_JSON is not set"
	[ -f "${HANABIRA_SERVICES_JSON}" ] ||
		die_like "HANABIRA_SERVICES_JSON points at a missing file"
}

# The message the scripts themselves must produce for a missing description.
die_like() {
	echo "expected: $1" >&2
	exit 1
}

require_stack

start_all_sh="${SCRIPT_DIR}/start-all.sh"

# Run the script through bash: a build sandbox has no /usr/bin/env for its
# shebang (developers have one, so this is equivalent either way).
run_start_all() {
	bash "${start_all_sh}" "$@"
}

# --- fixtures ----------------------------------------------------------------

# A fake checkout: the scripts resolve the repository root from the working
# directory and refuse to run from a read-only store copy.
repo="$(mktemp -d)"
mkdir -p "${repo}/backend" "${repo}/nix/scripts"
: >"${repo}/flake.nix"
cd "${repo}"

# --- the description arrives through the environment ------------------------

# 1. Without it, an actionable message rather than a jq traceback.
out="$(
	unset HANABIRA_SERVICES_JSON
	run_start_all status 2>&1 || true
)"
case "${out}" in
*HANABIRA_SERVICES_JSON*) ;;
*)
	fail "a missing description must be reported, got: ${out}"
	;;
esac

out="$(HANABIRA_SERVICES_JSON=/does/not/exist run_start_all status 2>&1 || true)"
case "${out}" in
*HANABIRA_SERVICES_JSON*missing*) ;;
*)
	fail "a missing description file must be reported, got: ${out}"
	;;
esac

# 2. A store copy run from outside a checkout is refused instead of operating
#    on the store. Only applies when the scripts themselves come from the
#    store, which is how the flake check runs this test; by hand they live in
#    the checkout and simply work.
case "${start_all_sh}" in
/nix/store/*)
	out="$(cd / && HANABIRA_SERVICES_JSON="${HANABIRA_SERVICES_JSON}" run_start_all status 2>&1 || true)"
	case "${out}" in
	*"read-only Nix store copy"*) ;;
	*)
		fail "running a store copy outside a checkout must be refused, got: ${out}"
		;;
	esac
	;;
esac

# --- the functions themselves, with the description loaded ------------------

data_root="$(mktemp -d)"
export HANABIRA_DATA_ROOT="${data_root}"
export HANABIRA_PORT_DIR="${HANABIRA_DATA_ROOT}/run"
mkdir -p "${HANABIRA_PORT_DIR}"

# shellcheck source=hanabira-lib.sh
source "${SCRIPT_DIR}/hanabira-lib.sh"

# 3. Port precedence: an explicit override, then the port recorded at start
#    time, then the description.
[ "$(stack_port nginx)" = "8888" ] ||
	fail "the description supplies the default port"
echo 9123 >"${HANABIRA_PORT_DIR}/nginx.port"
[ "$(stack_port nginx)" = "9123" ] ||
	fail "a recorded port must win over the description"
[ "$(NGINX_PORT=9000 stack_port nginx)" = "9000" ] ||
	fail "an override must win over a recorded port"
[ "$(stack_port_env_var dictionary)" = "DICTIONARY_PORT" ] ||
	fail "override variable naming"
rm -f "${HANABIRA_PORT_DIR}/nginx.port"

# start-all.sh only runs main() when executed, so sourcing it gives us its
# renderers without starting anything. (It fixes the nginx port once, the way
# a real run does.)
# shellcheck source=start-all.sh
source "${start_all_sh}"

# 4. argv: the dev variant, with every placeholder substituted.
resolve_argv mongod
[ "${ARGV[0]}" = "mongod" ] || fail "argv[0] is the binary, got '${ARGV[0]}'"
for placeholder in "{port}" "{dataDir}" "{logDir}" "{runDir}"; do
	case " ${ARGV[*]} " in
	*" ${placeholder} "*) fail "unsubstituted ${placeholder} in: ${ARGV[*]}" ;;
	esac
done
case " ${ARGV[*]} " in
*" --port 27017 "*) ;;
*) fail "the port was not substituted: ${ARGV[*]}" ;;
esac
case " ${ARGV[*]} " in
*" --dbpath ${HANABIRA_DATA_ROOT}/data/mongodb "*) ;;
*) fail "the data directory was not substituted: ${ARGV[*]}" ;;
esac
case " ${ARGV[*]} " in
*" --pidfilepath ${HANABIRA_PORT_DIR}/mongod.pid "*) ;;
*) fail "mongod must record its pid like every other service: ${ARGV[*]}" ;;
esac

resolve_argv frontend
[ "${ARGV[0]}" = "node_modules/.bin/next" ] && [ "${ARGV[1]}" = "dev" ] ||
	fail "the frontend runs its dev argv in dev: ${ARGV[*]}"

# 5. Names: pid files, log files (nginx_error for nginx), liveness.
[ "$(pid_file nginx)" = "${HANABIRA_DATA_ROOT}/run/nginx.pid" ] ||
	fail "pid file naming"
[ "$(log_file_of nginx)" = "${HANABIRA_DATA_ROOT}/logs/nginx_error.log" ] ||
	fail "nginx logs to nginx_error.log"
[ "$(log_file_of flask)" = "${HANABIRA_DATA_ROOT}/logs/flask.log" ] ||
	fail "flask logs to flask.log"
pid_is_alive nginx && fail "a service with no pid file must not count as running"

# 6. Every service in the description reaches status.
status_out="$(status)"
for name in mongod dictionary express flask frontend nginx; do
	case "${status_out}" in
	*"${name}"*) ;;
	*) fail "status does not mention ${name}" ;;
	esac
done

# 7. nginx routes, rendered from the description's proxy prefixes.
generate_nginx_conf
conf="${HANABIRA_DATA_ROOT}/nginx.conf"
[ -f "${conf}" ] || fail "generate_nginx_conf wrote nothing"
for route in "/:3000" "/e-api/:8000" "/f-api/:5100" "/d-api/:5200"; do
	prefix="${route%%:*}"
	port="${route##*:}"
	grep -A1 "^        location ${prefix} {$" "${conf}" | grep -q "proxy_pass http://127.0.0.1:${port};" ||
		fail "nginx: location ${prefix} should proxy to ${port}"
done
if grep -qE 'proxy_pass http://127\.0\.0\.1:[0-9]+/[a-z-]+' "${conf}"; then
	fail "nginx: the URI must be forwarded unchanged (the backends serve their own prefixes)"
fi

# Both ways of choosing a port must reach the generated configuration: the
# port recorded at start time, and an override on the command line.
echo 3100 >"${HANABIRA_PORT_DIR}/frontend.port"
generate_nginx_conf
grep -A1 '^        location / {$' "${conf}" | grep -q '127.0.0.1:3100;' ||
	fail "nginx: a recorded port must reach the configuration"
(
	export FRONTEND_PORT=3200
	generate_nginx_conf
)
grep -A1 '^        location / {$' "${conf}" | grep -q '127.0.0.1:3200;' ||
	fail "nginx: an override must reach the configuration"

# 8. logs: naming, the mongo alias, and both failure modes.
mkdir -p "${HANABIRA_DATA_ROOT}/logs"
echo "from mongod" >"${HANABIRA_DATA_ROOT}/logs/mongod.log"
run_start_all logs mongod | grep -q "from mongod" ||
	fail "logs should tail the service log"
run_start_all logs mongo | grep -q "from mongod" ||
	fail "'logs mongo' should resolve to mongod"
out="$(run_start_all logs nonsense 2>&1 || true)"
case "${out}" in
*"unknown service 'nonsense'"*) ;;
*) fail "logs should reject an unknown service, got: ${out}" ;;
esac
out="$(run_start_all bogus-command 2>&1 || true)"
case "${out}" in
*usage:*) ;;
*) fail "an unknown command should print usage, got: ${out}" ;;
esac

echo "contract: the stack description renders as documented"
