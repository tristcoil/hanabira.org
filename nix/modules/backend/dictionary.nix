{
  stdenv,
  mongodb,
  nodejs,
  writeShellScript,
  bash,
  makeDirectory,
}:

{
  ports,
  dataDir ? "/tmp/mongodb",
}:
{
  name = "dictionary-db";
  version = "1.0";

  executable = null;

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
    ${bash}/bin/bash ${./wait-for-mongo.sh} ${toString ports.mongo}

    # Seed if enabled
    echo "Seeding database with jmdict data..."
    node seed_jmdict_data.js

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
}
