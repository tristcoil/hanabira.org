{
  description = "Hanabira.org - Japanese learning platform";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    let
      # MongoDB is not packaged for macOS upstream, so the dev shell is Linux-only.
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
    in
    flake-utils.lib.eachSystem systems (
      system:
      let
        # MongoDB is SSPL-licensed; opt in for it (and nothing else).
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfreePredicate =
            pkg:
            builtins.elem (nixpkgs.lib.getName pkg) [
              "mongodb"
              "mongodb-ce"
            ];
        };
        lib = nixpkgs.lib;

        # The stack, defined once. The dev shell, the shell scripts and the
        # NixOS module all render this (see nix/services.nix); the checks
        # below keep that description honest.
        stack = import ./nix/services.nix { inherit pkgs; };
      in
      {
        # nix develop -> shell with all tooling for every service
        devShells.default = import ./nix/devshell.nix { inherit pkgs; };

        # Prebuilt MongoDB server (downloads the official tarball + patches it;
        # SSPL, so the unfree predicate above allows it).
        packages.mongodb-ce = pkgs.mongodb-ce;

        # nix fmt. nix 2.34 invokes the formatter with no file list (it then
        # reads stdin and formats nothing), so the wrapper discovers the
        # repository's Nix files itself; when nix does forward files it passes
        # them straight through.
        formatter = pkgs.writeShellApplication {
          name = "nixfmt-wrapper";
          runtimeInputs = [ pkgs.nixfmt ];
          text = ''
            if [ "$#" -eq 0 ]; then
              files="$(git ls-files --cached --others --exclude-standard -- '*.nix' 2>/dev/null || true)"
              if [ -z "$files" ]; then
                files="$(find . -name '*.nix' -not -path '*/.*' -not -path '*/node_modules/*' | sort)"
              fi
              # shellcheck disable=SC2086
              set -- $files
            fi
            [ "$#" -gt 0 ] || { echo "no Nix files to format" >&2; exit 1; }
            exec nixfmt "$@"
          '';
        };

        checks = {
          devShell = self.devShells.${system}.default;

          # shellcheck the orchestration scripts (lib and contract test included)
          scripts =
            pkgs.runCommand "hanabira-scripts-check"
              {
                nativeBuildInputs = [ pkgs.shellcheck ];
              }
              ''
                shellcheck --severity=warning ${./nix/scripts}/*.sh
                mkdir -p "$out"
              '';

          # The stack description stays true: unique names, ports and routes,
          # and every directory, package.json and config template it
          # references exists in the source tree.
          stack =
            pkgs.runCommandLocal "hanabira-stack-check"
              {
                nativeBuildInputs = [ pkgs.jq ];
              }
              ''
                table=${stack.json}
                jq -e '
                  (map(.name) | length) == (map(.name) | unique | length) and
                  (map(.port) | length) == (map(.port) | unique | length) and
                  (map(select(.proxy != null) | .proxy) | length)
                    == (map(select(.proxy != null) | .proxy) | unique | length) and
                  (all(.[]; .proxy == null or (.proxy | startswith("/") and endswith("/")))) and
                  (all(.[]; .name != "" and .description != "" and (.port | type == "number")))
                ' "$table" > /dev/null ||
                  { echo "stack invariants failed: names, ports and routes must be unique"; exit 1; }

                checked=0
                while read -r rel; do
                  [ -e "${self}/$rel" ] ||
                    { echo "stack table references a missing path: $rel"; exit 1; }
                  checked=$((checked + 1))
                done < <(jq -r '
                  .[] |
                    (.dir // empty),
                    (select(.npm == true) | "\(.dir)/package.json"),
                    (select(.config != null) | "\(.dir)/\(.config).dummy")
                ' "$table")
                [ "$checked" -ge 4 ] ||
                  { echo "expected the stack table to reference at least 4 paths, checked $checked"; exit 1; }

                mkdir -p "$out"
              '';

          # The description → processes contract, exercised without booting the
          # stack: port precedence, argv substitution, log and route naming,
          # the status/logs surface and the guards. Same test a developer runs
          # from `nix develop`, so it is covered by the shellcheck check too.
          script-contract =
            pkgs.runCommandLocal "hanabira-script-contract"
              {
                # The tools a dev shell provides, so the scripts' own
                # preconditions hold and the checks run the same path a
                # developer does.
                nativeBuildInputs = [
                  pkgs.jq
                  pkgs.curl
                  pkgs.mongosh
                  pkgs.git
                  pkgs.nodejs_22
                  (stack.packageOf "gunicorn")
                  self.packages.${system}.mongodb-ce
                ];
              }
              ''
                export HANABIRA_SERVICES_JSON=${stack.json}
                export HOME="$PWD"   # mongosh expects a writable home
                # Started through bash: a build sandbox has no /usr/bin/env for
                # the script's shebang.
                ${pkgs.bash}/bin/bash ${self}/nix/scripts/contract-test.sh
                mkdir -p "$out"
              '';

          # The NixOS module evaluates and generates what the stack describes:
          # one systemd unit per process, one nginx location per proxy prefix,
          # one port option per service.
          module =
            let
              vm = self.nixosConfigurations.vm;
              generated = pkgs.writeText "hanabira-module.json" (
                builtins.toJSON {
                  # Description is forced too: a unit's metadata evaluates
                  # lazily, so an error in it only appears when something
                  # builds the system (that has bitten here).
                  units = lib.mapAttrs (name: unit: {
                    description = unit.description or null;
                    ExecStart = unit.serviceConfig.ExecStart or null;
                    ExecStartPre = unit.serviceConfig.ExecStartPre or null;
                  }) (lib.filterAttrs (name: _: lib.hasPrefix "hanabira-" name) vm.config.systemd.services);
                  locations = lib.mapAttrs (_: loc: loc.proxyPass or null) (
                    vm.config.services.nginx.virtualHosts.${vm.config.services.hanabira.domain}.locations
                  );
                  ports = vm.config.services.hanabira.ports;
                  user = vm.config.users.users.hanabira.name;
                }
              );
            in
            pkgs.runCommandLocal "hanabira-module-eval"
              {
                nativeBuildInputs = [ pkgs.jq ];
              }
              ''
                install -Dm644 ${generated} "$out/module.json"
                jq -e '
                  (.user == "hanabira")
                  and ([.units | keys[] | select(startswith("hanabira-"))] | length) >= 5
                  and (.locations | keys | sort) == ["/", "/d-api/", "/e-api/", "/f-api/"]
                  and ([.ports | keys[]] | sort)
                    == ["dictionary", "express", "flask", "frontend", "mongod", "nginx"]
                ' "$out/module.json" > /dev/null ||
                  { echo "the module did not generate the expected units, vhost or port options"; exit 1; }
              '';
        };
      }
    )
    // {
      # Production deployment module (NixOS).
      #   imports = [ hanabira.nixosModules.hanabira ];
      #   services.hanabira.enable = true;
      nixosModules.hanabira = import ./nix/nixos/module.nix { inherit self; };

      # Ready-to-boot test VM of the full stack:
      #   nixos-rebuild build-vm --flake .#vm
      #   ./result/bin/run-hanabira-vm
      nixosConfigurations.vm = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          self.nixosModules.hanabira
          # mongodb-ce is SSPL-licensed (see nix/nixos/module.nix notes)
          {
            nixpkgs.config.allowUnfreePredicate = pkg: builtins.elem (nixpkgs.lib.getName pkg) [ "mongodb-ce" ];
          }
          "${nixpkgs}/nixos/modules/virtualisation/qemu-vm.nix"
          {
            services.hanabira.enable = true;
            networking.hostName = "hanabira-vm";
            # Smaller footprint for a test VM
            documentation.enable = false;
            virtualisation.memorySize = 2048;
          }
        ];
      };
    };

}
