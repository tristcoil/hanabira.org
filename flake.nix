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
  description = "Hanabira.org - Japanese learning platform";

  imports = [
    ./modules/config.nix
    ./modules/mongodb.nix
    ./modules/frontend-next.nix
    ./modules/backend/express.nix
    ./modules/backend/flask.nix
    ./modules/backend/dictionary.nix
    ./modules/nginx.nix
    ./modules/devshell.nix
  ];

  # Default to devshell
  default = {
    devShell = import ./modules/devshell.nix {
      inherit ports;
    };
  };
}
