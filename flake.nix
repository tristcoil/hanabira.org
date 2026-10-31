{
  description = "Hanabira.org - Japanese learning platform";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    {
      self,
      nixpkgs,
      ...
    }@inputs:
    {
      nixosModules.default = {
        import = ./modules;
      };
    };
}
