#!/usr/bin/env bash
# Wait until MongoDB answers a ping (exit 0), or give up after the given
# number of attempts (exit 1).
#
# This is the single readiness implementation for the whole stack:
# start-all.sh reaches it through nix/scripts/hanabira-lib.sh, and the NixOS
# module runs it from the services' ExecStartPre.
#
# Usage: wait-for-mongo.sh [port] [attempts]
# Port defaults to $MONGO_PORT, then 27017 (the stack default; both callers
# pass the port explicitly).

set -euo pipefail

PORT="${1:-${MONGO_PORT:-27017}}"
MAX_ATTEMPTS="${2:-60}"

for _ in $(seq 1 "${MAX_ATTEMPTS}"); do
	if mongosh --quiet --port "${PORT}" --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
		echo "MongoDB is ready on port ${PORT}"
		exit 0
	fi
	sleep 1
done

echo "ERROR: MongoDB did not become ready on port ${PORT} after ${MAX_ATTEMPTS}s" >&2
exit 1
