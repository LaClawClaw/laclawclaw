#!/bin/bash
# Deploy LaClawClaw to Hetzner
# Usage: ./scripts/deploy.sh <server-ip>
set -euo pipefail

SERVER_IP="${1:?Usage: deploy.sh <server-ip>}"
SSH_TARGET="root@${SERVER_IP}"

echo "=== Deploying LaClawClaw to ${SERVER_IP} ==="

# Sync files
rsync -avz --exclude=node_modules --exclude=.git \
  /Users/elias/laclawclaw/ \
  "${SSH_TARGET}:/home/laclawclaw/repo/"

# Install deps and restart
ssh "${SSH_TARGET}" << 'EOF'
cd /home/laclawclaw/repo/api && npm install --production
cp -r /home/laclawclaw/repo/landing/* /home/laclawclaw/landing/
chown -R laclawclaw:laclawclaw /home/laclawclaw
systemctl restart laclawclaw-api
systemctl reload caddy
echo "Deploy complete."
EOF
