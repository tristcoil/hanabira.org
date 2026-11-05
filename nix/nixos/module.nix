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
# What the module is *about* - the processes, their directories, ports,
# commands, nginx routes, option defaults - comes from ../services.nix, the
# same description the dev shell and nix/scripts/*.sh use. The stack is
# therefore defined in exactly one place, and this module only decides how
# it runs under systemd.
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
  stack = import ../services.nix { inherit pkgs; };

  user = "hanabira";
  stateDir = "/var/lib/hanabira";
  siteDir = "${stateDir}/src";
  dataDir = "${stateDir}/mongodb";

  useSSL = cfg.enableSSL && cfg.domain != "_";

  # Working directory, then the port/PATH/env/pre-steps the module owns:
  # every one of them is read off the service record in services.nix.
  #
  # argv: the {port}/{dataDir}/{logDir} placeholders are substituted here,
  # because those locations belong to this deployment.
  argvOf =
    svc:
    let
      port = toString cfg.ports.${svc.name};
    in
    map (lib.replaceStrings [ "{port}" "{dataDir}" "{logDir}" ] [ port dataDir stateDir ]) svc.argv;

  binaryOf = svc: stack.packageOf (stack.binaryOf svc);

  execStartOf =
    svc:
    lib.escapeShellArgs ([ "${binaryOf svc}/bin/${stack.binaryOf svc}" ] ++ lib.drop 1 (argvOf svc));

  environmentOf = svc: [
    "PATH=${
      lib.makeBinPath (
        [
          (binaryOf svc)
          pkgs.coreutils
        ]
        ++ map (tool: stack.toolOf tool) (svc.needs or [ ])
      )
    }:/usr/bin:/bin"
    "HOME=${stateDir}"
    "NODE_ENV=production"
    "PORT=${toString cfg.ports.${svc.name}}"
  ];

  # Shared by every unit: run as the service user, restart on failure, and
  # confine writes to the state tree.
  baseService = {
    User = user;
    Group = user;
    Restart = "on-failure";
    RestartSec = "5s";
    # A first boot installs npm dependencies, seeds the databases and builds
    # the frontend - all far beyond systemd's 90s default start timeout, which
    # would kill the units mid-install and let them restart forever with a
    # partial node_modules.
    TimeoutStartSec = "30min";
    NoNewPrivileges = true;
    PrivateTmp = true;
    ProtectSystem = "strict";
    ProtectKernelTunables = true;
    ProtectKernelModules = true;
    ProtectControlGroups = true;
    RestrictSUIDSGID = true;
    ReadWritePaths = [
      siteDir
      dataDir
      stateDir
    ];
  };

  # npm install for a service directory. Always run (idempotent, and mostly
  # served from the cache with --prefer-offline): an install that was
  # interrupted leaves node_modules present but incomplete, and a presence
  # check would skip repairing it forever. node_modules and .next survive
  # activations through the rsync protect filters, so this is cheap on a warm
  # system and self-healing on a cold one.
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
        echo "Installing npm dependencies for ${dir}..."
        npm install --prefer-offline --include=dev --no-audit --no-fund
      '';
    };

  # A service's declared config file (e.g. config.json for DEEPL/OpenAI keys)
  # is created from its .dummy template on first boot.
  ensureConfig =
    svc:
    let
      dir = "${siteDir}/${svc.dir}";
      file = svc.config;
    in
    pkgs.writeShellApplication {
      name = "hanabira-ensure-config";
      runtimeInputs = [ pkgs.coreutils ];
      text = ''
        config="${dir}/${file}"
        if [ ! -f "$config" ]; then
          cp "${dir}/${file}.dummy" "$config"
          echo "Created ${file} from its .dummy template for ${svc.description} - edit it to add this service's keys."
        fi
      '';
    };

  # The production build a service declares (Next.js), run before it starts.
  buildStep =
    dir:
    pkgs.writeShellApplication {
      name = "hanabira-build";
      runtimeInputs = [
        pkgs.nodejs_22
        pkgs.coreutils
      ];
      text = ''
        cd ${dir}
        echo "Building the production frontend (this takes a few minutes)..."
        npm run build
      '';
    };

  # The stack's readiness check, run from the flake source rather than the
  # deployed copy so it cannot go missing mid-activation.
  waitForMongo = "${pkgs.bash}/bin/bash ${cfg.package}/nix/scripts/wait-for-mongo.sh";

  # One systemd service per process in the stack description.
  serviceUnits = map (svc: {
    name = "hanabira-${svc.name}";
    value = {
      description = "Hanabira.org ${svc.description}";
      after = [
        "hanabira-mongod.service"
      ]
      ++ lib.optional cfg.seedStaticData "hanabira-seed-static-data.service";
      wantedBy = [ "multi-user.target" ];
      serviceConfig = baseService // {
        WorkingDirectory = "${siteDir}/${svc.dir}";
        Environment = environmentOf svc;
        ExecStartPre = lib.flatten [
          (lib.optional (svc.mongo or false) "${waitForMongo} ${toString cfg.ports.mongod}")
          (lib.optional (svc.npm or false
          ) "${ensureNodeModules "${siteDir}/${svc.dir}"}/bin/hanabira-npm-install")
          (lib.optional (svc.config or null != null) "${ensureConfig svc}/bin/hanabira-ensure-config")
          (lib.optional (svc.build or null != null) "${buildStep "${siteDir}/${svc.dir}"}/bin/hanabira-build")
        ];
        ExecStart = execStartOf svc;
      };
    };
  }) stack.application;

  # nginx routes: one location per service that declares a proxy prefix, all
  # answering with the recommended proxy settings. The backends serve their
  # own prefixed routes (/e-api/v1/, /f-api/v1/, /d-api/v1/), so the URI is
  # forwarded unchanged.
  nginxLocations = lib.listToAttrs (
    map (
      svc:
      lib.nameValuePair svc.proxy {
        proxyPass = "http://127.0.0.1:${toString cfg.ports.${svc.name}}";
        proxyWebsockets = true;
        recommendedProxySettings = true;
      }
    ) stack.proxied
  );
in
{
  options.services.hanabira = {
    enable = lib.mkEnableOption "Hanabira.org stack (MongoDB + 3 backends + Next.js frontend behind nginx)";

    package = lib.mkOption {
      type = lib.types.package;
      default = self;
      description = "Source tree to deploy to /var/lib/hanabira/src. Defaults to this flake; override it to deploy a different checkout.";
    };

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

    # One port option per process in nix/services.nix; the defaults come from
    # there too, so the option list and the stack can never disagree.
    ports = lib.mapAttrs (
      name: svc:
      lib.mkOption {
        type = lib.types.port;
        default = svc.port;
        description = "Port for ${svc.description}.";
      }
    ) stack.byNameAttr;
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
    # node_modules, .next and generated config.json are protected from
    # deletion so activation never discards installed dependencies or builds.
    # Two things only a real boot will teach you:
    #   - rsync creates only the last path component, so nix/scripts (two
    #     levels below the site directory) needs its parent first;
    #   - rsync -a also copies the store's read-only modes, which leaves the
    #     deployed directories at 555 and npm install unable to create
    #     node_modules ("the operation was rejected by your operating system").
    # Both are handled below, and both are exercised by the boot test.
    system.activationScripts.hanabira-src = lib.stringAfter [ "users" "groups" ] ''
      mkdir -p ${siteDir}
      mkdir -p ${siteDir}/nix
      ${lib.concatStringsSep "\n" (
        map (svc: ''
          mkdir -p ${siteDir}/${svc.dir}
          ${pkgs.rsync}/bin/rsync -a --delete \
            --filter='P node_modules' --filter='P .next' --filter='P config.json' \
            ${cfg.package}/${svc.dir}/ ${siteDir}/${svc.dir}/
        '') stack.application
      )}
      ${pkgs.rsync}/bin/rsync -a --delete \
        ${cfg.package}/nix/scripts/ ${siteDir}/nix/scripts/
      chmod -R u+w ${siteDir}
      chown -R ${user}:${user} ${siteDir}
      mkdir -p ${dataDir}
      chown -R ${user}:${user} ${dataDir}
    '';

    systemd.services = lib.listToAttrs serviceUnits // {
      # MongoDB is the one service with no working directory in the tree.
      hanabira-mongod = {
        description = "Hanabira.org ${(stack.byName "mongod").description}";
        after = [ "network.target" ];
        wantedBy = [ "multi-user.target" ];
        serviceConfig = baseService // {
          Environment = [ "HOME=${stateDir}" ];
          ExecStart = execStartOf (stack.byName "mongod");
        };
      };

      # One-shot static data seeding (idempotent; jmdict skipped unless the
      # jmdict_json_data_simplified dataset is present in the source tree).
      hanabira-seed-static-data = lib.mkIf cfg.seedStaticData {
        description = "Hanabira.org static data seeding";
        after = [ "hanabira-mongod.service" ];
        wantedBy = [ "multi-user.target" ];
        serviceConfig = baseService // {
          Type = "oneshot";
          RemainAfterExit = true;
          Environment = [
            "PATH=${
              lib.makeBinPath [
                pkgs.nodejs_22
                pkgs.mongosh
                pkgs.jq
                pkgs.coreutils
              ]
            }:/usr/bin:/bin"
            "HOME=${stateDir}"
            "NODE_ENV=production"
            "MONGO_PORT=${toString cfg.ports.mongod}"
            "HANABIRA_SERVICES_JSON=${stack.json}"
          ];
          ExecStartPre = [ "${waitForMongo} ${toString cfg.ports.mongod}" ];
          # Run through bash: the script's shebang is #!/usr/bin/env bash, and
          # bash is not on this unit's PATH (the same reason waitForMongo is
          # invoked explicitly).
          ExecStart = "${pkgs.bash}/bin/bash ${siteDir}/nix/scripts/seed-db.sh";
        };
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
        locations = nginxLocations;
      };
    };

    networking.firewall.allowedTCPPorts = lib.mkIf cfg.openFirewall (
      [ cfg.ports.nginx ] ++ lib.optional useSSL 443
    );
  };
}
