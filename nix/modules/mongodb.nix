{
  stdenv,
  mongodb,
  writeShellScript,
  runHook,
}:

{
  ports,
  dataDir ? "/tmp/mongodb",
  extraConfig ? "",
}:
{
  name = "mongodb";
  version = "8.0";

  # MongoDB is service only, not executable
  executable = null;

  # Create startup script
  startScript = writeShellScript "start-mongodb" ''
    #!/bin/bash
    set -euo pipefail

    # Create data and log directories
    mkdir -p ${dataDir}
    mkdir -p /var/log/mongodb

    # Start MongoDB in daemon mode
    mongod --dbpath ${dataDir} \
           --bind_ip_all \
           --fork \
           --logpath /var/log/mongodb/mongod.log \
           --port ${toString ports.mongo} \
           ${extraConfig}

    echo "MongoDB started on port ${toString ports.mongo}"
  '';

  # Create stop script
  stopScript = writeShellScript "stop-mongodb" ''
    #!/bin/bash
    set -euo pipefail

    # Find and stop MongoDB process
    pkill -f "mongod.*--port ${toString ports.mongo}" || true
    echo "MongoDB stopped"
  '';

  # Create ready check script
  readyScript = writeShellScript "check-mongodb-ready" ''
    #!/bin/bash
    set -euo pipefail

    # Wait for MongoDB to be accepting connections
    for i in $(seq 1 30); do
      mongosh --port ${toString ports.mongo} --eval "db.adminCommand('ping')" &>/dev/null && exit 0
      sleep 1
    done

    echo "MongoDB not ready after 30 seconds"
    exit 1
  '';
}
