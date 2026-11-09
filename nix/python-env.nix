# Python environment for the flask backend (backend/flask: server.py + the
# modules it registers, run under gunicorn).
#
# backend/flask has no requirements.txt; keep this list in sync with its
# Dockerfile if one is added. One list, two consumers: the dev shell and the
# NixOS both import this file, so the two never drift apart.

{ pkgs }:

pkgs.python3.withPackages (
  ps: with ps; [
    flask
    flask-cors
    flask-pymongo
    pymongo
    requests
    gunicorn
  ]
)
