{
  config,
  pkgs,
  inputs,
  ...
}:
{
  # Import modules
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

  # Use ports from global config
  ports = {
    nginx = config.global.ports.hanabira;
    frontend = config.global.ports.hanabira-frontend;
    express = config.global.ports.hanabira-express;
    flask = config.global.ports.hanabira-flask;
    dictionary = config.global.ports.hanabira-dictionary;
    mongo = config.global.ports.hanabira-mongo;
  };

  # Default to devshell
  default = {
    devShell = import ./modules/devshell.nix {
      inherit ports;
    };
  };
}
