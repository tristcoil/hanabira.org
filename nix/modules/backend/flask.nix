{ stdenv, python3, mongodb, writeShellScript, bash }:

{
  ports,
  dataDir ? "/tmp/mongodb",
}: let
  startScript = writeShellScript "start-flask-db" ''
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
    ${bash}/bin/bash ${./../scripts/wait-for-mongo.sh} ${toString ports.mongo}
    
    # Start Flask server with Gunicorn
    echo "Starting Flask DB server on port ${toString ports.flask}..."
    ./venv/bin/gunicorn -w 4 -b 0.0.0.0:${toString ports.flask} server:app
  '';

  stopScript = writeShellScript "stop-flask-db" ''
    #!/bin/bash
    set -euo pipefail
    pkill -f "gunicorn" || true
    echo "Flask DB stopped"
  '';

  readyScript = writeShellScript "check-flask-ready" ''
    #!/bin/bash
    set -euo pipefail
    curl -s http://localhost:${toString ports.flask}/health &>/dev/null
  '';
in {
  name = "flask-db";
  version = "1.0";

  executable = null;
  startScript;
  stopScript;
  readyScript;
}