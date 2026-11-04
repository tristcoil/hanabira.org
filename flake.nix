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

        # nix fmt
        formatter = pkgs.nixfmt;

        checks = {
          devShell = self.devShells.${system}.default;

          # shellcheck the orchestration scripts (lib included)
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

          # The NixOS module evaluates and generates what the stack describes:
          # one systemd unit per process, one nginx location per proxy prefix,
          # one port option per service.
          module =
            let
              vm = self.nixosConfigurations.vm;
              generated = pkgs.writeText "hanabira-module.json" (
                builtins.toJSON {
                  units = lib.mapAttrs (name: unit: {
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
