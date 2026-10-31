{
  config ? {
    ports = { };
  },
  ...
}:

let
  ports =
    config.ports or {
      nginx = 65040;
      frontend = 65041;
      express = 65042;
      flask = 65043;
      dictionary = 65044;
      mongo = 65045;
    };
in
{
  name = "hanabira";
  version = "0.1.0";

  outputs = {
    devShell = import /etc/nixos/apps/hanabira/modules/devshell.nix {
      ports = ports;
    };
  };
}
