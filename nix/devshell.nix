# Development environment for Hanabira.org.
#
# Provides every runtime dependency of the 5 services (Node.js, Python/Flask
# stack, MongoDB + mongosh, mecab, nginx) plus the tools used by the
# orchestration scripts in nix/scripts/.
#
# Service processes are managed by ./nix/scripts/start-all.sh, which expects
# the services to be started manually / through the documented commands.

{
  pkgs,
}:
let
  # Flask backend (backend/flask): server.py + modules + gunicorn
  pythonEnv = pkgs.python3.withPackages (
    ps: with ps; [
      flask
      flask-cors
      flask-pymongo
      pymongo
      requests
      gunicorn
    ]
  );
in
pkgs.mkShell {
  name = "hanabira-dev";

  packages = [
    # Node.js with npm (frontend-next, express-db, dictionary-db)
    pkgs.nodejs_22

    # Flask backend (provides `flask` and `gunicorn` on PATH)
    pythonEnv

    # MongoDB (all backends) + mongosh used by the scripts.
    # mongodb-ce ships prebuilt official binaries (SSPL, hence the unfree
    # opt-in in flake.nix); building it downloads the tarball and patches it,
    # which avoids the multi-hour source compile of pkgs.mongodb.
    pkgs.mongodb-ce
    pkgs.mongosh

    # mecab binary used by the mecab-async npm package (dictionary-db).
    # The nixpkgs mecab package bundles the ipadic dictionary.
    pkgs.mecab

    # Reverse proxy (serves the whole app on http://localhost:8888)
    pkgs.nginx

    # Utilities used by the orchestration scripts
    pkgs.procps # pgrep / pkill
    pkgs.coreutils
    pkgs.curl
    pkgs.git
    pkgs.jq
  ];

  env = {
    # Service ports (defaults mirrored in nix/scripts/start-all.sh)
    MONGODB_PORT = "27017";
    EXPRESS_PORT = "8000";
    FLASK_PORT = "5100";
    DICTIONARY_PORT = "5200";
    FRONTEND_PORT = "3000";
    NGINX_PORT = "8888";

    NODE_ENV = "development";
  };

  shellHook = ''
    cat <<'BANNER'
    Hanabira.org development environment
    ===================================

      start   ./nix/scripts/start-all.sh start
      stop    ./nix/scripts/start-all.sh stop
      status  ./nix/scripts/start-all.sh status
      logs    ./nix/scripts/start-all.sh logs [service]

    Services are started in dependency order:
      MongoDB -> seeding -> dictionary-db -> express-db -> flask-db -> frontend -> nginx

    Then open http://localhost:8888

    First start downloads npm dependencies for each Node service and may
    take a few minutes. Use 'logs' to watch the individual service logs.
    BANNER
  '';
}
