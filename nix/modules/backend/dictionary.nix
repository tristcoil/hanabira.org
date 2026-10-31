{ stdenv, mongodb, nodejs, writeShellScript, bash, jq }:

{
  ports,
  dataDir ? "/tmp/mongodb",
  dbPrefix ? "sourceDB",
  enableAutoSeed ? true,
  seedDataDir ? null,
}: let
  seedScript = if enableAutoSeed then writeShellScript "seed-dictionary-db" ''
    #!/bin/bash
    set -euo pipefail
    
    echo "Waiting for MongoDB..."
    ${bash}/bin/bash ${./scripts/wait-for-mongo.sh} ${toString ports.mongo}
    
    echo "Seeding database with jmdict data..."
    node seed_jmdict_data.js
    
    echo "Database seeding completed"
  '' else writeShellScript "skip-seeding" "echo 'Auto-seeding disabled'\n";

  startScript = writeShellScript "start-dictionary-db" ''
    #!/bin/bash
    set -euo pipefail
    
    # Ensure data directory exists
    mkdir -p ${dataDir}
    
    # Start MongoDB if not running
    if ! pgrep -q mongod; then
      mongod --dbpath ${dataDir} \
             --bind_ip_all \
             --fork \
             --logpath /var/log/mongodb/mongod.log \
             --port ${toString ports.mongo}
    fi
    
    # Wait for MongoDB
    ${bash}/bin/bash ${./scripts/wait-for-mongo.sh} ${toString ports.mongo}
    
    # Seed if enabled
    if [ "${if enableAutoSeed then "true" else "false"}" = "true" ]; then
      ${seedScript}/bin/seed-dictionary-db
    fi
    
    # Start Express server
    echo "Starting dictionary Express server on port ${toString ports.dictionary}..."
    node main_server.js
  '';

  stopScript = writeShellScript "stop-dictionary-db" ''
    #!/bin/bash
    set -euo pipefail
    pkill -f "main_server.js" || true
    echo "Dictionary DB stopped"
  '';

  readyScript = writeShellScript "check-dictionary-ready" ''
    #!/bin/bash
    set -euo pipefail
    curl -s http://localhost:${toString ports.dictionary}/health &>/dev/null
  '';
in {
  name = "dictionary-db";
  version = "1.0";

  executable = null;
  startScript;
  stopScript;
  readyScript;
}