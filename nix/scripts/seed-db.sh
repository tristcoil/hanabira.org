#!/bin/bash
# Seed database script for Hanabira
# This script seeds the MongoDB database with initial data

set -euo pipefail

echo "Seeding Hanabira database..."

# Navigate to dictionary backend
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

# Check if MongoDB is running
if ! pgrep -q mongod; then
	echo "ERROR: MongoDB is not running. Start it first."
	exit 1
fi

# Seed jmdict data
echo "Seeding jmdict data..."
cd backend/dictionary
node seed_jmdict_data.js

echo "Database seeding completed"
