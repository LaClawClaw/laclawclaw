#!/bin/bash
# LaClawClaw — Hetzner Server Setup
# Run this on a fresh Hetzner CPX11 (2 vCPU, 2GB RAM, 40GB — €4.85/mo)
# OS: Ubuntu 24.04
#
# Prerequisites:
#   1. Create server in Hetzner Cloud console (console.hetzner.cloud)
#      Login: founders@injester.com (credentials in 1Password, Clawdbot vault)
#   2. Add your SSH key during creation
#   3. Note the server IP
#   4. In Cloudflare DNS for laclawclaw.com:
#      - A record: @ → <server-ip> (proxied)
#      - A record: api → <server-ip> (proxied)
#      - A record: docs → <server-ip> (proxied)
#
# Then SSH in and run: curl -fsSL https://raw.githubusercontent.com/LaClawClaw/laclawclaw/main/infra/setup-hetzner.sh | bash

set -euo pipefail

echo "=== LaClawClaw Server Setup ==="

# System updates
apt-get update && apt-get upgrade -y
apt-get install -y curl git ufw caddy nodejs npm

# Install Node 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create app user
useradd -m -s /bin/bash laclawclaw || true
mkdir -p /home/laclawclaw/app
mkdir -p /home/laclawclaw/landing

# Clone repo
cd /home/laclawclaw
git clone https://github.com/LaClawClaw/laclawclaw.git repo 2>/dev/null || (cd repo && git pull)

# Copy landing page
cp -r /home/laclawclaw/repo/landing/* /home/laclawclaw/landing/

# Install API dependencies
cd /home/laclawclaw/repo/api
npm install --production

# Setup Caddy
cat > /etc/caddy/Caddyfile << 'CADDY'
laclawclaw.com {
    root * /home/laclawclaw/landing
    file_server
    encode gzip

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}

api.laclawclaw.com {
    reverse_proxy localhost:3100

    header {
        Access-Control-Allow-Origin *
        Access-Control-Allow-Methods "GET, POST, OPTIONS"
        Access-Control-Allow-Headers "Authorization, Content-Type, X-Agent-Id"
    }
}

docs.laclawclaw.com {
    root * /home/laclawclaw/repo/docs/site
    file_server
    encode gzip
}
CADDY

# Setup systemd service for API
cat > /etc/systemd/system/laclawclaw-api.service << 'SERVICE'
[Unit]
Description=LaClawClaw Agent API
After=network.target

[Service]
Type=simple
User=laclawclaw
WorkingDirectory=/home/laclawclaw/repo/api
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3100
EnvironmentFile=/home/laclawclaw/.env

[Install]
WantedBy=multi-user.target
SERVICE

# Enable and start services
systemctl daemon-reload
systemctl enable caddy laclawclaw-api
systemctl restart caddy
systemctl start laclawclaw-api

chown -R laclawclaw:laclawclaw /home/laclawclaw

echo "=== Setup Complete ==="
echo "Landing page: https://laclawclaw.com"
echo "API: https://api.laclawclaw.com"
echo "Docs: https://docs.laclawclaw.com"
echo ""
echo "Next: Create /home/laclawclaw/.env with:"
echo "  SHOPIFY_STORE_DOMAIN=your-store.myshopify.com"
echo "  SHOPIFY_STOREFRONT_TOKEN=..."
echo "  SHOPIFY_ADMIN_TOKEN=..."
echo "  API_MASTER_KEY=<generate with: openssl rand -hex 32>"
