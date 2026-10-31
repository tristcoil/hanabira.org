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
  name = "express-db";
  version = "1.0";

  executable = null;

  startScript = writeShellScript "start-express-db" ''
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

    # Seed database
    echo "Seeding database with grammar, words, kanji, reading data..."
    node ./seeding_scripts/word_relationships_GPT.js
    sleep 2
    node ./seeding_scripts/seed_tanos_vocab_to_db.js
    sleep 2
    node ./seeding_scripts/seed_grammar_to_db.js
    sleep 2
    node ./seeding_scripts/seed_kanji_to_db.js
    sleep 2
    node ./seeding_scripts/seed_reading_to_db.js
    sleep 2
    node ./seeding_scripts/seed_grammar_to_db_other_langs.js

    # Start Express server
    echo "Starting Express DB server on port ${toString ports.express}..."
    node my_server.js
  '';

  stopScript = writeShellScript "stop-express-db" ''
    #!/bin/bash
    set -euo pipefail
    pkill -f "my_server.js" || true
    echo "Express DB stopped"
  '';

  readyScript = writeShellScript "check-express-ready" ''
    #!/bin/bash
    set -euo pipefail
    curl -s http://localhost:${toString ports.express}/health &>/dev/null
  '';
}
