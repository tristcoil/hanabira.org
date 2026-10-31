{
  stdenv,
  nextjs,
  nodejs,
  npm,
  writeShellScript,
  bash,
  makeDirectory,
}:

{
  ports,
  enableBuildCache ? true,
  distDir ? ".next",
}:
{
  name = "frontend-next";
  version = "0.1.0";

  executable = null;

  startScript = writeShellScript "start-frontend" ''
    #!/bin/bash
    set -euo pipefail

    # Check if build already done
    if [ ! -d ${distDir} ]; then
      echo "Building frontend..."
      npm run build
    fi

    echo "Starting Next.js frontend on port ${toString ports.frontend}..."
    npm run dev
  '';

  stopScript = writeShellScript "stop-frontend" ''
    #!/bin/bash
    set -euo pipefail
    pkill -f "next dev" || true
    echo "Frontend stopped"
  '';

  readyScript = writeShellScript "check-frontend-ready" ''
    #!/bin/bash
    set -euo pipefail
    curl -s http://localhost:${toString ports.frontend} &>/dev/null
  '';
}
