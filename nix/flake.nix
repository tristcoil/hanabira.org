{
  description = "Hanabira.org - Japanese learning platform with native services";

  # Default ports configuration
  ports = {
    nginx = 8888;
    frontend = 3000;
    express = 8000;
    flask = 5100;
    dictionary = 5200;
    mongo = 27017;
  };

  # Default to devshell
  default = {
    devShell = import ./modules/devshell.nix {
      inherit ports;
    };
  };
}
