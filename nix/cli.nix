# `hanabira` - one command for the dev stack, available inside `nix develop`.
#
#   hanabira start | stop | restart | status
#   hanabira logs [service] [-f]
#
# A thin wrapper over nix/scripts/start-all.sh, which renders the stack
# description from nix/services.nix (exported by the dev shell).

{ pkgs }:

pkgs.writeShellApplication {
  name = "hanabira";
  runtimeInputs = [ pkgs.coreutils ];
  # Reference the directory, not the file: a single-file path gets flattened
  # into the store as <name> without its directory, and the script locates
  # its helpers relative to itself.
  text = ''
    exec ${./scripts}/start-all.sh "$@"
  '';
}
