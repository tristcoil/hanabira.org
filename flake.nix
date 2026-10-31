{
  imports = [
    /etc/nixos/apps/hanabira
  ];

  default = {
    devShell = import /etc/nixos/apps/hanabira/modules/devshell.nix {
      ports = {
        nginx = 65040;
        frontend = 65041;
        express = 65042;
        flask = 65043;
        dictionary = 65044;
        mongo = 65045;
      };
    };
  };
}
