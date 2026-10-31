{
  lib,
  stdenv,
  writeShellScript,
  makeFile,
}:

{
  ports = {
    nginx = lib.mkOption {
      type = lib.types.int;
      description = "Nginx port";
      default = 8888;
    };
    frontend = lib.mkOption {
      type = lib.types.int;
      description = "Frontend port";
      default = 3000;
    };
    express = lib.mkOption {
      type = lib.types.int;
      description = "Express backend port";
      default = 8000;
    };
    flask = lib.mkOption {
      type = lib.types.int;
      description = "Flask backend port";
      default = 5100;
    };
    dictionary = lib.mkOption {
      type = lib.types.int;
      description = "Dictionary backend port";
      default = 5200;
    };
    mongo = lib.mkOption {
      type = lib.types.int;
      description = "MongoDB port";
      default = 27017;
    };
  };
}
