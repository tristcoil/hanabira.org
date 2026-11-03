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

          # shellcheck all orchestration scripts
          scripts =
            pkgs.runCommand "hanabira-scripts-check"
              {
                nativeBuildInputs = [ pkgs.shellcheck ];
              }
              ''
                shellcheck --severity=warning ${./nix/scripts}/*.sh
                mkdir -p "$out"
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
