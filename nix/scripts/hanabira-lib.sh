#!/usr/bin/env bash
# Shared helpers for the Hanabira shell scripts (start-all.sh, seed-db.sh).
#
# The stack itself - services, ports, working directories, commands, nginx
# routes - is NOT described here. It lives in nix/services.nix and reaches
# these scripts as JSON through HANABIRA_SERVICES_JSON, which the dev shell
# (and the NixOS seed service) sets. This file is only the plumbing for
# reading that description and for the process/readiness helpers that go
# with running it.

set -euo pipefail

# bash 4.4+ is needed for empty-array expansion under `set -u` (the nixpkgs
# bash used by the dev shell is 5.x; macOS ships 3.2, hence the message).
if [ -z "${BASH_VERSINFO:-}" ] || [ "${BASH_VERSINFO[0]}" -lt 4 ] ||
	[ "${BASH_VERSINFO[0]}" -eq 4 ] && [ "${BASH_VERSINFO[1]}" -lt 4 ]; then
	echo "[hanabira ERROR] bash 4.4 or newer is required - run the scripts from inside 'nix develop'" >&2
	exit 1
fi

HANABIRA_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Repository root: the caller's checkout when the script was launched from
# one, otherwise the tree this script ships in (a subdirectory, or the copy
# the NixOS module deploys to /var/lib/hanabira/src).
ROOT_DIR="$(cd "${HANABIRA_LIB_DIR}/../.." && pwd)"
if [ -f "${PWD}/flake.nix" ] && [ -d "${PWD}/backend" ] && [ -d "${PWD}/nix/scripts" ]; then
	ROOT_DIR="${PWD}"
fi
case "${ROOT_DIR}" in
/nix/store/*)
	echo "[hanabira ERROR] this script is running from a read-only Nix store copy." >&2
	echo "[hanabira ERROR] run it from a Hanabira checkout: ./nix/scripts/start-all.sh start" >&2
	exit 1
	;;
esac

log() {
	local tag="${HANABIRA_LOG_TAG:-}"
	echo "[${tag:+$tag }$(date '+%H:%M:%S')] $*"
}

die() {
	local tag="${HANABIRA_LOG_TAG:-}"
	echo "[${tag:+$tag }ERROR] $*" >&2
	exit 1
}

# --- the stack description (nix/services.nix) --------------------------------

# Fail early with an actionable message: the table is not embedded in the
# scripts, it is handed over by the environment.
require_stack() {
	[ -n "${HANABIRA_SERVICES_JSON:-}" ] ||
		die "HANABIRA_SERVICES_JSON is not set - the stack description comes from 'nix develop'"
	[ -f "${HANABIRA_SERVICES_JSON}" ] ||
		die "HANABIRA_SERVICES_JSON points at a missing file: ${HANABIRA_SERVICES_JSON}"
	jq -e 'type == "array" and length > 0' "${HANABIRA_SERVICES_JSON}" >/dev/null 2>&1 ||
		die "HANABIRA_SERVICES_JSON does not hold a stack description JSON array"
}

# stack_jq <jq program...>: run jq over the stack description.
stack_jq() {
	jq "$@" "${HANABIRA_SERVICES_JSON}"
}

stack_service_names() {
	stack_jq -r '.[].name'
}

# stack_field <service> <field>: print a field, empty when the service (or
# the field) is absent - callers treat empty as "not applicable".
stack_field() {
	stack_jq -r --arg n "$1" --arg f "$2" 'map(select(.name == $n)) | .[0][$f] // empty'
}

# stack_port_env_var <service>: the name of the environment variable that
# overrides a service's port (stack_port applies it).
stack_port_env_var() {
	printf '%s_PORT\n' "$(tr '[:lower:]' '[:upper:]' <<<"$1")"
}

# stack_port <service>: <NAME>_PORT from the environment when set, otherwise
# the port recorded at start time (HANABIRA_PORT_DIR/<service>.port, written
# by whoever runs the processes so later status/stop/log invocations see the
# ports actually in use), otherwise the default from the stack description.
stack_port() {
	local var value recorded
	var="$(stack_port_env_var "$1")"
	value="${!var:-}"
	if [ -z "${value}" ] && [ -n "${HANABIRA_PORT_DIR:-}" ] && [ -f "${HANABIRA_PORT_DIR}/$1.port" ]; then
		recorded="$(cat "${HANABIRA_PORT_DIR}/$1.port" 2>/dev/null)" || recorded=""
		[ -n "${recorded}" ] && value="${recorded}"
	fi
	[ -n "${value}" ] || value="$(stack_field "$1" port)"
	printf '%s\n' "${value}"
}

# --- MongoDB ----------------------------------------------------------------

mongo_port() {
	if [ -z "${MONGO_PORT:-}" ]; then
		MONGO_PORT="$(stack_field mongod port)"
		export MONGO_PORT
	fi
	printf '%s\n' "${MONGO_PORT}"
}

mongo_is_up() {
	mongosh --quiet --port "$(mongo_port)" --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1
}

# Single readiness implementation, shared by start-all.sh and the systemd
# services (see nix/scripts/wait-for-mongo.sh).
wait_for_mongo() {
	"${HANABIRA_LIB_DIR}/wait-for-mongo.sh" "$(mongo_port)" "${1:-60}"
}

# --- process helpers --------------------------------------------------------

# probe_is_up <service>: is the service answering? The probe is a stack fact
# ("probe" in nix/services.nix): most services answer HTTP, MongoDB answers
# a ping.
probe_is_up() {
	local name="$1"
	case "$(stack_field "${name}" probe)" in
	mongo)
		mongosh --quiet --port "$(stack_port "${name}")" --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1
		;;
	*)
		curl -s -o /dev/null --max-time 2 "http://127.0.0.1:$(stack_port "${name}")"
		;;
	esac
}

# pids_with_cwd <dir>: pids of live processes whose working directory is
# <dir>. Path-scoped, so it only ever matches our own services, never a
# similarly named process of some other project.
pids_with_cwd() {
	local dir="$1" proc
	for proc in /proc/[0-9]*; do
		[ "$(readlink "${proc}/cwd" 2>/dev/null)" = "${dir}" ] || continue
		echo "${proc#/proc/}"
	done
}
