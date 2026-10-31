{
  stdenv,
  nginx,
  writeShellScript,
  bash,
}:

{
  ports,
  proxyTimeout ? 60,
  enableSSL ? false,
}:
let
  # Generate Nginx config
  nginxConf = writeShellScript "nginx-conf" ''
        #!/bin/bash
        cat << EOF
    worker_processes auto;

    events {
        worker_connections 1024;
    }

    http {
        include mime.types;
        default_type application/octet-stream;
        
        # Logging
        access_log /tmp/nginx_access.log;
        error_log /tmp/nginx_error.log;
        
        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        
        # Upstream definitions
        upstream frontend {
            server 127.0.0.1:${toString ports.frontend};
        }
        
        upstream express {
            server 127.0.0.1:${toString ports.express};
        }
        
        upstream flask {
            server 127.0.0.1:${toString ports.flask};
        }
        
        upstream dictionary {
            server 127.0.0.1:${toString ports.dictionary};
        }
        
        server {
            listen ${toString ports.nginx};
            server_name localhost;
            
            # Timeouts
            proxy_connect_timeout ${toString proxyTimeout};
            proxy_read_timeout ${toString proxyTimeout};
            proxy_send_timeout ${toString proxyTimeout};
            
            # Frontend (static files)
            location / {
                proxy_pass http://frontend;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
            
            # Express API endpoints
            location /e-api/ {
                proxy_pass http://express;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
            
            # Flask API endpoints
            location /f-api/ {
                proxy_pass http://flask;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
            
            # Dictionary API endpoints
            location /d-api/ {
                proxy_pass http://dictionary;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
            }
        }
    }
  '';
in
{
  name = "nginx";
  version = "1.24";

  executable = null;

  # Nginx config file
  configFile = nginxConf;

  # Start script
  startScript = writeShellScript "start-nginx" ''
    #!/bin/bash
    set -euo pipefail

    # Create log directory
    mkdir -p /tmp

    # Write nginx config
    echo "${nginxConf}" > /tmp/nginx.conf

    # Start nginx
    nginx -c /tmp/nginx.conf
    echo "Nginx started on port ${toString ports.nginx}"
  '';

  stopScript = writeShellScript "stop-nginx" ''
    #!/bin/bash
    set -euo pipefail
    nginx -s stop || true
    echo "Nginx stopped"
  '';

  readyScript = writeShellScript "check-nginx-ready" ''
    #!/bin/bash
    set -euo pipefail
    curl -s http://localhost:${toString ports.nginx} &>/dev/null
  '';
}
