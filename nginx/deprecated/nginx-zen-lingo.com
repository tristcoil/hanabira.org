[root@VPS-O2A4 sites-enabled]# cat zen-lingo.com 
# Redirect HTTP traffic to HTTPS
server {
    if ($host = zen-lingo.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  listen 80;
  server_name zen-lingo.com;

  return 301 https://$server_name$request_uri;


}

server {
  listen 443 ssl;
  server_name zen-lingo.com;
    ssl_certificate /etc/letsencrypt/live/zen-lingo.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/zen-lingo.com/privkey.pem; # managed by Certbot


  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass_request_headers on;
    proxy_http_version 1.1;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header Upgrade $http_upgrade;
  }

  location /api/videos {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass_request_headers on;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /e-api/v1/words {
    proxy_pass http://localhost:7000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass_request_headers on;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /e-api/v1/grammars {
    proxy_pass http://localhost:7000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass_request_headers on;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /e-api/v1/grammar-titles {
    proxy_pass http://localhost:7000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass_request_headers on;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /e-api/v1/grammar-details {
    proxy_pass http://localhost:7000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass_request_headers on;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }
}

[root@VPS-O2A4 sites-enabled]# 