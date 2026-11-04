# Development environment for Hanabira.org.
#
# Tools and environment only: the processes themselves are run by
# nix/scripts/start-all.sh (also on PATH here as `hanabira`), which renders
# the stack description from nix/services.nix. This shell hands that
# description over as JSON in HANABIRA_SERVICES_JSON and provides every
# executable it calls for.
#
#   hanabira start   MongoDB -> seed -> dictionary -> express -> flask -> frontend -> nginx
#   hanabira stop / restart / status / logs [service] [-f]

{ pkgs }:
let
  lib = pkgs.lib;
  stack = import ./services.nix { inherit pkgs; };

  # One package per service binary, plus the extra tools individual services
  # spawn (mecab for dictionary-db, mongosh for the Mongo-backed services).
  stackPackages = lib.flatten (
    map (
      svc: [ (stack.packageOf (stack.binaryOf svc)) ] ++ map (tool: stack.toolOf tool) (svc.needs or [ ])
    ) stack.services
  );

  # Tooling the orchestration scripts need themselves.
  scriptPackages = [
    pkgs.jq # reading the stack description
    pkgs.procps # pkill / pgrep
    pkgs.git
    pkgs.coreutils
    pkgs.bash
  ];

  # Ports are deliberately NOT exported here: the scripts default to the
  # stack description, remember the port a `start` actually used, and honour
  # <NAME>_PORT overrides. Exporting defaults would silently outrank the
  # recorded ports (the reason `status` used to report the wrong port).
in
pkgs.mkShell {
  name = "hanabira-dev";

  packages = lib.unique (stackPackages ++ scriptPackages ++ [ (import ./cli.nix { inherit pkgs; }) ]);

  env = {
    NODE_ENV = "development";
  };

  shellHook = ''
    # The stack description, as the scripts consume it.
    export HANABIRA_SERVICES_JSON="${stack.json}"
    # mime.types for the generated nginx config (nix/scripts/start-all.sh).
    export HANABIRA_NGINX_MIME_TYPES="${pkgs.nginx}/conf/mime.types"

    echo "Hanabira.org development environment"
    echo "==================================="
    echo
    echo "  hanabira start    MongoDB -> seed -> dictionary -> express -> flask -> frontend -> nginx"
    echo "  hanabira stop / restart / status"
    echo "  hanabira logs [service] [-f]"
    echo
    echo "Stack (nix/services.nix):"
    while IFS="$(printf '\t')" read -r name port dir; do
      printf '  %-10s :%-5s %s\n' "$name" "$port" "$dir"
    done < <(jq -r '.[] | "\(.name)\t\(.port)\t\(.dir // "-")"' "$HANABIRA_SERVICES_JSON")
    echo
    echo "Then open http://localhost:$(jq -r 'map(select(.name == "nginx")) | .[0].port' "$HANABIRA_SERVICES_JSON")"
    echo "First start downloads npm dependencies for each Node service and may take a few minutes."
    echo "Ports may be overridden per service: <SERVICE>_PORT=<port> hanabira start"
  '';
}
