# NixOS module for running the Hanabira.org stack in production.
#
# Import into your configuration.nix:
#
#   imports = [ hanabira.nixosModules.hanabira ];
#   services.hanabira.enable = true;
#
# Provides: a systemd service per service (mongod, dictionary-db, express-db,
# flask-db, frontend-next), automatic idempotent static-data seeding on
# deployment, and an nginx virtual host that proxies the whole app.
#
# The flake source is copied to /var/lib/hanabira/src on activation; npm
# dependencies and the Next.js production build are installed/built there on
# first boot (so the host needs registry access once during deployment).
#
# NOTE: mongodb-ce is SSPL-licensed (unfree), so the host must allow it, e.g.
# narrowly:
#   nixpkgs.config.allowUnfreePredicate = pkg: builtins.elem (lib.getName pkg) [ "mongodb-ce" ];
# The flake's own nixosConfigurations.vm does this automatically.

{ self }:
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.hanabira;

  user = "hanabira";
  siteDir = "/var/lib/hanabira/src";
  dataDir = "/var/lib/hanabira/mongodb";
  logDir = "/var/lib/hanabira/logs";
  stateDir = "/var/lib/hanabira";

  # Flask backend: server.py + modules + gunicorn
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

  nodePath = lib.makeBinPath [
    pkgs.nodejs_22
    pkgs.mecab # mecab binary used by the mecab-async npm package
    pkgs.coreutils
  ];

  serviceEnv = [
    "PATH=${nodePath}:/usr/bin:/bin"
    "HOME=${stateDir}"
    "NODE_ENV=production"
  ];
  mongoEnv = [
    "PATH=${
      lib.makeBinPath [
        pkgs.nodejs_22
        pkgs.mongosh
        pkgs.coreutils
      ]
    }:/usr/bin:/bin"
    "HOME=${stateDir}"
  ];

  useSSL = cfg.enableSSL && cfg.domain != "_";

  # Retries mongosh until MongoDB answers (dependencies wait for it this way).
  waitForMongo = pkgs.writeShellApplication {
    name = "hanabira-wait-for-mongo";
    runtimeInputs = [
      pkgs.mongosh
      pkgs.coreutils
    ];
    text = ''
      for _ in $(seq 1 60); do
        if mongosh --quiet --port ${toString cfg.ports.mongo} \
            --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
          echo "MongoDB is ready"
          exit 0
        fi
        sleep 1
      done
      echo "MongoDB did not become ready in time" >&2
      exit 1
    '';
  };

  # Installs npm dependencies on first boot (node_modules survives activations).
  ensureNodeModules =
    dir:
    pkgs.writeShellApplication {
      name = "hanabira-npm-install";
      runtimeInputs = [
        pkgs.nodejs_22
        pkgs.coreutils
      ];
      text = ''
        cd ${dir}
        if [ ! -d node_modules ]; then
          echo "Installing npm dependencies for ${dir} (needs network access)..."
          npm install --no-audit --no-fund
        fi
      '';
    };

  # backend/dictionary reads config.json (DEEPL/OpenAI keys) at startup.
  ensureDictionaryConfig = pkgs.writeShellApplication {
    name = "hanabira-ensure-dictionary-config";
    runtimeInputs = [ pkgs.coreutils ];
    text = ''
      config="${siteDir}/backend/dictionary/config.json"
      if [ ! -f "$config" ]; then
        cp "${siteDir}/backend/dictionary/config.json.dummy" "$config"
        echo "Created config.json from the dummy template - add your DEEPL/OpenAI keys there."
      fi
    '';
  };

  # Next.js production build on first deploy.
  buildFrontend = pkgs.writeShellApplication {
    name = "hanabira-build-frontend";
    runtimeInputs = [
      pkgs.nodejs_22
      pkgs.coreutils
    ];
    text = ''
      cd ${siteDir}/frontend-next
      if [ ! -d .next ]; then
        echo "Building production frontend (this takes a few minutes)..."
        npm run build
      fi
    '';
  };
in
{
  options.services.hanabira = {
    enable = lib.mkEnableOption "Hanabira.org stack (MongoDB + 3 backends + Next.js frontend behind nginx)";

    domain = lib.mkOption {
      type = lib.types.str;
      default = "localhost";
      description = "nginx virtual host name. Use a real domain together with enableSSL, or '_' for a catch-all vhost.";
    };

    enableSSL = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "Serve the vhost with HTTPS (forceSSL + ACME). Requires a real domain and security.acme.acceptTerms.";
    };

    openFirewall = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Open the nginx port in the NixOS firewall.";
    };

    seedStaticData = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Seed the static MongoDB data (grammar, kanji, reading, vocabulary; jmdict when the data dir is present) on every boot. Seeding is idempotent.";
    };

    ports = {
      nginx = lib.mkOption {
        type = lib.types.port;
        default = 8888;
        description = "nginx reverse proxy port (public entry point).";
      };
      frontend = lib.mkOption {
        type = lib.types.port;
        default = 3000;
        description = "Next.js frontend port.";
      };
      express = lib.mkOption {
        type = lib.types.port;
        default = 8000;
        description = "express-db static dictionary API port.";
      };
      flask = lib.mkOption {
        type = lib.types.port;
        default = 5100;
        description = "flask-db user data API port.";
      };
      dictionary = lib.mkOption {
        type = lib.types.port;
        default = 5200;
        description = "dictionary-db text parser API port.";
      };
      mongo = lib.mkOption {
        type = lib.types.port;
        default = 27017;
        description = "MongoDB port (bound to localhost only).";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    users.users.${user} = {
      isSystemUser = true;
      group = user;
      home = stateDir;
      createHome = true;
      description = "Hanabira.org service user";
    };
    users.groups.${user} = { };

    # Deploy a writable copy of the flake source (store paths are read-only).
    # node_modules, .next and generated config.json are protected from deletion
    # so activation never discards installed dependencies or builds.
    system.activationScripts.hanabira-src = lib.stringAfter [ "users" "groups" ] ''
      mkdir -p ${siteDir}
      ${pkgs.rsync}/bin/rsync -a --delete \
        --filter='P node_modules' --filter='P .next' --filter='P config.json' \
        ${self}/backend/ ${siteDir}/backend/
      ${pkgs.rsync}/bin/rsync -a --delete \
        --filter='P node_modules' --filter='P .next' \
        ${self}/frontend-next/ ${siteDir}/frontend-next/
      ${pkgs.rsync}/bin/rsync -a --delete \
        ${self}/nix/scripts/ ${siteDir}/nix/scripts/
      chown -R ${user}:${user} ${siteDir}
      mkdir -p ${dataDir} ${logDir}
      chown -R ${user}:${user} ${dataDir} ${logDir}
    '';

    systemd.services.hanabira-mongod = {
      description = "Hanabira.org MongoDB (static + user data)";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];
      serviceConfig = {
        User = user;
        Group = user;
        Restart = "on-failure";
        RestartSec = "5s";
        ExecStart = "${pkgs.mongodb-ce}/bin/mongod --dbpath ${dataDir} --bind_ip 127.0.0.1 --port ${toString cfg.ports.mongo}";
      };
    };

    # One-shot static data seeding (idempotent; jmdict skipped unless the
    # jmdict_json_data_simplified dataset is present in the source tree).
    systemd.services.hanabira-seed-static-data = lib.mkIf cfg.seedStaticData {
      description = "Hanabira.org static data seeding";
      after = [ "hanabira-mongod.service" ];
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        Type = "oneshot";
        RemainAfterExit = true;
        User = user;
        Group = user;
        Environment = mongoEnv ++ [ "MONGO_PORT=${toString cfg.ports.mongo}" ];
        ExecStartPre = "${waitForMongo}/bin/hanabira-wait-for-mongo";
        ExecStart = "${siteDir}/nix/scripts/seed-db.sh";
      };
    };

    systemd.services.hanabira-dictionary-db = {
      description = "Hanabira.org dictionary-db (text parser, Japanese NLP)";
      after = [
        "hanabira-mongod.service"
      ]
      ++ lib.optional cfg.seedStaticData "hanabira-seed-static-data.service";
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        User = user;
        Group = user;
        WorkingDirectory = "${siteDir}/backend/dictionary";
        Environment = serviceEnv ++ [ "PORT=${toString cfg.ports.dictionary}" ];
        ExecStartPre = [
          "${waitForMongo}/bin/hanabira-wait-for-mongo"
          "${ensureNodeModules "${siteDir}/backend/dictionary"}/bin/hanabira-npm-install"
          "${ensureDictionaryConfig}/bin/hanabira-ensure-dictionary-config"
        ];
        ExecStart = "${pkgs.nodejs_22}/bin/node main_server.js";
        Restart = "on-failure";
      };
    };

    systemd.services.hanabira-express-db = {
      description = "Hanabira.org express-db (static dictionary DB)";
      after = [
        "hanabira-mongod.service"
      ]
      ++ lib.optional cfg.seedStaticData "hanabira-seed-static-data.service";
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        User = user;
        Group = user;
        WorkingDirectory = "${siteDir}/backend/express";
        Environment = serviceEnv ++ [ "PORT=${toString cfg.ports.express}" ];
        ExecStartPre = [
          "${waitForMongo}/bin/hanabira-wait-for-mongo"
          "${ensureNodeModules "${siteDir}/backend/express"}/bin/hanabira-npm-install"
        ];
        ExecStart = "${pkgs.nodejs_22}/bin/node my_server.js";
        Restart = "on-failure";
      };
    };

    systemd.services.hanabira-flask = {
      description = "Hanabira.org flask-db (user specific data)";
      after = [ "hanabira-mongod.service" ];
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        User = user;
        Group = user;
        WorkingDirectory = "${siteDir}/backend/flask";
        Environment = serviceEnv ++ [ "PORT=${toString cfg.ports.flask}" ];
        ExecStartPre = "${waitForMongo}/bin/hanabira-wait-for-mongo";
        ExecStart = "${pythonEnv}/bin/gunicorn -w 4 -b 0.0.0.0:${toString cfg.ports.flask} server:app";
        Restart = "on-failure";
      };
    };

    systemd.services.hanabira-frontend = {
      description = "Hanabira.org frontend (Next.js production server)";
      after = [
        "hanabira-express-db.service"
        "hanabira-flask.service"
        "hanabira-dictionary-db.service"
      ];
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        User = user;
        Group = user;
        WorkingDirectory = "${siteDir}/frontend-next";
        Environment = serviceEnv ++ [ "PORT=${toString cfg.ports.frontend}" ];
        ExecStartPre = [
          "${ensureNodeModules "${siteDir}/frontend-next"}/bin/hanabira-npm-install"
          "${buildFrontend}/bin/hanabira-build-frontend"
        ];
        ExecStart = "${pkgs.nodejs_22}/bin/node ${siteDir}/frontend-next/node_modules/next/dist/bin/next start -H 0.0.0.0 -p ${toString cfg.ports.frontend}";
        Restart = "on-failure";
      };
    };

    services.nginx = {
      enable = true;
      virtualHosts.${cfg.domain} = {
        listen = [
          {
            addr = "0.0.0.0";
            port = if useSSL then 443 else cfg.ports.nginx;
          }
        ];
        forceSSL = useSSL;
        enableACME = useSSL;
        locations = {
          "/" = {
            proxyPass = "http://127.0.0.1:${toString cfg.ports.frontend}";
            proxyWebsockets = true;
            extraConfig = ''
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            '';
          };
          "/e-api/" = {
            proxyPass = "http://127.0.0.1:${toString cfg.ports.express}/e-api/";
            proxyWebsockets = true;
            extraConfig = ''
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            '';
          };
          "/f-api/" = {
            proxyPass = "http://127.0.0.1:${toString cfg.ports.flask}/f-api/";
            proxyWebsockets = true;
            extraConfig = ''
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            '';
          };
          "/d-api/" = {
            proxyPass = "http://127.0.0.1:${toString cfg.ports.dictionary}/d-api/";
            proxyWebsockets = true;
            extraConfig = ''
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            '';
          };
        };
      };
    };

    networking.firewall.allowedTCPPorts = lib.mkIf cfg.openFirewall (
      [ cfg.ports.nginx ] ++ lib.optional useSSL 443
    );
  };
}
