{
  description = "Hanabira.org - Japanese learning platform with native services";

  # Import module configurations
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

  # Default ports configuration
  ports = {
    nginx = 8888;
    frontend = 3000;
    express = 8000;
    flask = 5100;
    dictionary = 5200;
    mongo = 27017;
  };

  # Development shell configuration
  devShell = {
    name = "hanabira-dev";
    packages = [
      # Core dependencies
      stdenv.mongodb
      stdenv.nodejs-20_x
      stdenv.mecab
      stdenv.libmecab-dev

      # Python dependencies
      stdenv.python3
      stdenv.python3Packages.flask
      stdenv.python3Packages.pymongo

      # Frontend dependencies
      stdenv.nodejs-18_x

      # Nginx
      stdenv.nginx

      # Utilities
      stdenv.curl
      stdenv.git
    ];

    env = {
      MONGODB_PORT = toString ports.mongo;
      EXPRESS_PORT = toString ports.express;
      FLASK_PORT = toString ports.flask;
      DICTIONARY_PORT = toString ports.dictionary;
      NGINX_PORT = toString ports.nginx;
      NODE_ENV = "development";
    };

    startScript = ./scripts/start-all.sh;
    readyScript = ./scripts/wait-for-mongo.sh;
  };

  # Package set
  packages = {
    # MongoDB service
    mongodb = import ./modules/mongodb.nix {
      inherit ports;
      dataDir = "/tmp/mongodb";
    };

    # Frontend
    frontend-next = import ./modules/frontend-next.nix {
      inherit ports;
    };

    # Backend services
    express-db = import ./modules/backend/express.nix {
      inherit ports;
    };

    flask-db = import ./modules/backend/flask.nix {
      inherit ports;
    };

    dictionary-db = import ./modules/backend/dictionary.nix {
      inherit ports;
    };

    # Proxy
    nginx = import ./modules/nginx.nix {
      inherit ports;
    };
  };

  # Default to devshell
  default = {
    devShell = import ./modules/devshell.nix {
      inherit ports;
    };
  };
}
