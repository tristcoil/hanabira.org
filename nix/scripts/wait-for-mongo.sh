#!/bin/bash
# Wait for MongoDB to be ready
# Usage: wait-for-mongo.sh <port> [max_attempts]

set -euo pipefail

PORT="${1:-27017}"
MAX_ATTEMPTS="${2:-30}"

echo "Waiting for MongoDB on port ${PORT}..."

for i in $(seq 1 ${MAX_ATTEMPTS}); do
	if mongosh --port "${PORT}" --eval "db.adminCommand('ping')" &>/dev/null; then
		echo "MongoDB is ready"
		exit 0
	fi
	sleep 1
done

echo "ERROR: MongoDB not ready after ${MAX_ATTEMPTS} seconds"
exit 1
