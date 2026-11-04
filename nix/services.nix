# The Hanabira stack, described once.
#
# This file is the single source of truth for *what the stack is*: which
# processes run, from which directory, on which port, what they need before
# they can start, and how nginx routes to them. Everything else under nix/
# is an adapter that renders this one description for one target:
#
#   nix/devshell.nix      tools + environment for `nix develop`
#   nix/scripts/*.sh      run the stack on this machine; the dev shell passes
#                         the description along as JSON in
#                         HANABIRA_SERVICES_JSON
#   nix/nixos/module.nix  systemd units, the nginx vhost and the
#                         services.hanabira options for production
#
# Adding a service here is the whole change: the dev shell PATH, start/stop/
# status/logs, the systemd unit, the nginx route and the documented port
# option all follow.
#
# `services` is ordered: start order, which is also dependency order.
#
# Per service:
#
#   name            short id; used for the pid/log file name, the
#                   <NAME>_PORT environment variable, and the systemd unit
#                   suffix (hanabira-<name>)
#   description     one line, shown in docs and `hanabira status`
#   dir             working directory relative to the repository root
#                   (absent for processes that run outside the tree)
#   port            default port
#   binary          executable that runs the service; tells the adapters
#                   which package provides it (defaults to head of argv)
#   argv            process arguments, argv[0] being the binary that runs the
#                   service. {port}, {dataDir} and {logDir} are substituted by
#                   the adapter that owns those locations ({runDir} is
#                   dev-only). Absent = not a process this file runs (nginx is
#                   configured, not executed, from here)
#   devArgv         dev-only argv (start-all.sh); production uses argv
#   npm             install npm dependencies into `dir` first
#   build           production-only build step in `dir`, run before start
#   config          config file to create from <file>.dummy when missing
#   mongo           MongoDB must answer a ping before the service starts
#   probe           how to tell the service is up: "http" (default) or "mongo"
#   proxy           nginx location prefix (absent = not proxied)
#   needs           extra tools that must be on PATH (e.g. "mecab")
#   logFile         log file base name in the dev runtime state dir
#                   (defaults to name)
#   startupSeconds  how long the dev scripts wait for readiness
#
# Keep this file in sync with the repository itself: `nix flake check`
# verifies every directory, package.json and config template referenced
# here actually exists.

{ pkgs }:
let
  services = [
    {
      name = "mongod";
      description = "MongoDB (static + user data)";
      port = 27017;
      probe = "mongo";
      binary = "mongod";
      argv = [
        "mongod"
        "--dbpath"
        "{dataDir}"
        "--bind_ip"
        "127.0.0.1"
        "--port"
        "{port}"
      ];
      devArgv = [
        "mongod"
        "--dbpath"
        "{dataDir}"
        "--bind_ip"
        "127.0.0.1"
        "--port"
        "{port}"
        "--fork"
        "--logpath"
        "{logDir}/mongod.log"
        # So the dev scripts own its pid like every other service's.
        "--pidfilepath"
        "{runDir}/mongod.pid"
        "--logappend"
      ];
      logFile = "mongod";
      startupSeconds = 60;
    }
    {
      name = "dictionary";
      description = "dictionary-db (text parser, Japanese NLP)";
      dir = "backend/dictionary";
      port = 5200;
      binary = "node";
      argv = [
        "node"
        "main_server.js"
      ];
      npm = true;
      mongo = true;
      config = "config.json";
      needs = [
        "mecab"
        "mongosh"
      ];
      proxy = "/d-api/";
      startupSeconds = 60;
    }
    {
      name = "express";
      description = "express-db (static dictionary DB)";
      dir = "backend/express";
      port = 8000;
      binary = "node";
      argv = [
        "node"
        "my_server.js"
      ];
      npm = true;
      mongo = true;
      needs = [ "mongosh" ];
      proxy = "/e-api/";
      startupSeconds = 60;
    }
    {
      name = "flask";
      description = "flask-db (user specific data)";
      dir = "backend/flask";
      port = 5100;
      binary = "gunicorn";
      argv = [
        "gunicorn"
        "-w"
        "4"
        "-b"
        "0.0.0.0:{port}"
        "server:app"
      ];
      mongo = true;
      needs = [ "mongosh" ];
      proxy = "/f-api/";
      startupSeconds = 60;
    }
    {
      name = "frontend";
      description = "frontend-next (Next.js)";
      dir = "frontend-next";
      port = 3000;
      binary = "node";
      argv = [
        "node"
        "node_modules/next/dist/bin/next"
        "start"
        "-H"
        "0.0.0.0"
        "-p"
        "{port}"
      ];
      devArgv = [
        "node_modules/.bin/next"
        "dev"
      ];
      npm = true;
      build = "npm run build";
      # Next.js serves the whole app from "/", so the frontend owns the
      # catch-all route.
      proxy = "/";
      startupSeconds = 120;
    }
    {
      name = "nginx";
      description = "nginx (reverse proxy serving the whole app)";
      port = 8888;
      binary = "nginx";
      logFile = "nginx_error";
      startupSeconds = 30;
    }
  ];

  binaryOf = service: service.binary or (builtins.head service.argv or null);

  # Processes whose argv the adapters execute. nginx is configured through
  # services.nginx in production and a generated config in dev, so it has
  # no argv.
  processes = builtins.filter (s: (s.argv or null) != null) services;

  # Processes that run from a directory inside the source tree (everything
  # except the mongod daemon), still in start order.
  application = builtins.filter (s: (s.dir or null) != null) processes;

  proxied = builtins.filter (s: (s.proxy or null) != null) services;

  byNameAttr = builtins.listToAttrs (
    map (s: {
      name = s.name;
      value = s;
    }) services
  );

  byName =
    name: byNameAttr.${name} or (throw "hanabira: nix/services.nix has no service named '${name}'");

  logFileOf = service: service.logFile or service.name;

  # Which package provides each binary. Used by the dev shell (PATH) and the
  # NixOS module (systemd unit PATH / ExecStart).
  binaryPackage = {
    node = pkgs.nodejs_22;
    # backend/flask runs under gunicorn from this environment.
    gunicorn = import ./python-env.nix { inherit pkgs; };
    mongod = pkgs.mongodb-ce;
    nginx = pkgs.nginx;
  };

  toolPackage = {
    # mecab binary spawned by the mecab-async npm package (dictionary-db).
    mecab = pkgs.mecab;
    mongosh = pkgs.mongosh;
    jq = pkgs.jq;
  };

  packageOf =
    binary: binaryPackage.${binary} or (throw "hanabira: no package provides the binary '${binary}'");

  toolOf = tool: toolPackage.${tool} or (throw "hanabira: no package provides the tool '${tool}'");

  # Every extra tool any service needs, de-duplicated (e.g. ["mecab" "mongosh"]).
  tools = pkgs.lib.unique (builtins.concatMap (s: map toolOf (s.needs or [ ])) processes);
in
{
  inherit
    services
    processes
    application
    proxied
    tools
    binaryOf
    logFileOf
    byName
    byNameAttr
    packageOf
    toolOf
    ;

  # The stack description as the shell scripts consume it. One derivation,
  # shared by the dev shell and the NixOS seed service.
  json = pkgs.writeText "hanabira-services.json" (builtins.toJSON services);

  # Python environment for the flask backend (see nix/python-env.nix).
  pythonEnv = packageOf "gunicorn";
}
