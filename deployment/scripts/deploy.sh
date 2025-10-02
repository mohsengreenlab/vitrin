#!/bin/bash
set -e

# Deployment Script for partnersystems_main
# This script sets up a completely isolated environment for the new app
# WITHOUT touching any existing apps, certificates, or configurations

echo "=========================================="
echo "PartnerSystems Main - Deployment Script"
echo "=========================================="
echo ""

# Configuration
APP_NAME="partnersystems_main"
APP_USER="partnersystems_main"
APP_PORT=3008
APP_DOMAIN="partnersystems.online"
APP_HOME="/home/${APP_USER}"
APP_DIR="${APP_HOME}/app"
LOG_DIR="${APP_HOME}/logs"
NGINX_AVAILABLE="/etc/nginx/sites-available/${APP_NAME}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${APP_NAME}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Creating dedicated system user${NC}"
if id "$APP_USER" &>/dev/null; then
    echo "  → User $APP_USER already exists, skipping..."
else
    useradd -m -s /bin/bash "$APP_USER"
    echo "  ✓ User $APP_USER created"
fi

echo ""
echo -e "${GREEN}Step 2: Creating directory structure${NC}"
mkdir -p "$APP_DIR"
mkdir -p "$LOG_DIR"
mkdir -p "${APP_DIR}/certs"
echo "  ✓ Directories created"

echo ""
echo -e "${GREEN}Step 3: Installing Node.js and PM2 (if needed)${NC}"
if ! command -v node &> /dev/null; then
    echo "  → Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "  → Node.js already installed: $(node --version)"
fi

if ! command -v pm2 &> /dev/null; then
    echo "  → Installing PM2 globally..."
    npm install -g pm2
else
    echo "  → PM2 already installed: $(pm2 --version)"
fi

echo ""
echo -e "${GREEN}Step 4: Copying application files${NC}"
echo "  → Copying from current directory to $APP_DIR"
rsync -av --exclude 'node_modules' --exclude '.git' \
    ./ "$APP_DIR/" || {
    echo -e "${RED}Error: Failed to copy files. Make sure you're running this from the app root directory.${NC}"
    exit 1
}
echo "  ✓ Application files copied (including deployment tools)"

echo ""
echo -e "${GREEN}Step 5: Setting up SSL certificate${NC}"
if [ -f "certs/singlestore_bundle.pem" ]; then
    cp certs/singlestore_bundle.pem "${APP_DIR}/certs/"
    echo "  ✓ SSL certificate copied"
else
    echo -e "${YELLOW}  ⚠ Warning: certs/singlestore_bundle.pem not found. You'll need to add it manually.${NC}"
fi

echo ""
echo -e "${GREEN}Step 6: Creating .env file${NC}"
if [ -f "${APP_DIR}/.env" ]; then
    echo -e "${YELLOW}  ⚠ .env file already exists, skipping...${NC}"
    echo "    To update configuration, edit: ${APP_DIR}/.env"
else
    cp deployment/configs/.env.template "${APP_DIR}/.env"
    echo "  ✓ .env template created at ${APP_DIR}/.env"
    echo ""
    echo -e "${YELLOW}  ⚠ IMPORTANT: Edit ${APP_DIR}/.env with your SingleStore credentials!${NC}"
fi

echo ""
echo -e "${GREEN}Step 7: Setting ownership and permissions${NC}"
chown -R "${APP_USER}:${APP_USER}" "$APP_HOME"
chmod 700 "$APP_HOME"
chmod 755 "$APP_DIR"
chmod 755 "$LOG_DIR"
chmod 600 "${APP_DIR}/.env"
chmod 644 "${APP_DIR}/certs/singlestore_bundle.pem" 2>/dev/null || true
echo "  ✓ Ownership and permissions set"

echo ""
echo -e "${GREEN}Step 8: Installing dependencies${NC}"
cd "$APP_DIR"
sudo -u "$APP_USER" npm install
echo "  ✓ Dependencies installed (including build tools)"

echo ""
echo -e "${GREEN}Step 9: Building application${NC}"
sudo -u "$APP_USER" npm run build
echo "  ✓ Application built"

echo ""
echo -e "${GREEN}Step 10: Pruning dev dependencies${NC}"
sudo -u "$APP_USER" npm prune --production
echo "  ✓ Development dependencies removed (production mode)"

echo ""
echo -e "${GREEN}Step 11: Setting up PM2${NC}"
cp deployment/configs/ecosystem.config.cjs "${APP_DIR}/"
sudo -u "$APP_USER" pm2 delete "$APP_NAME" 2>/dev/null || true
sudo -u "$APP_USER" pm2 start "${APP_DIR}/ecosystem.config.cjs"
sudo -u "$APP_USER" pm2 save
echo "  ✓ PM2 configured and started"

# Setup PM2 startup for this user
env PATH=$PATH:/usr/bin pm2 startup systemd -u "$APP_USER" --hp "$APP_HOME" | grep -v "You have to run this command as root" | bash || true
echo "  ✓ PM2 startup configured"

echo ""
echo -e "${GREEN}Step 12: Configuring Nginx${NC}"
if [ -f "$NGINX_AVAILABLE" ]; then
    echo -e "${YELLOW}  ⚠ Nginx config already exists at $NGINX_AVAILABLE${NC}"
    echo "    Review it manually if needed"
else
    cp deployment/configs/nginx-partnersystems.conf "$NGINX_AVAILABLE"
    ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
    echo "  ✓ Nginx configuration created and enabled"
fi

# Test Nginx configuration
nginx -t && {
    echo "  ✓ Nginx configuration valid"
} || {
    echo -e "${RED}  ✗ Nginx configuration has errors!${NC}"
    echo "    Fix the configuration at $NGINX_AVAILABLE"
    exit 1
}

echo ""
echo -e "${GREEN}Step 13: Reloading Nginx${NC}"
systemctl reload nginx
echo "  ✓ Nginx reloaded"

echo ""
echo -e "${GREEN}Step 14: Setting up SSL certificate with Certbot${NC}"
echo -e "${YELLOW}  ⚠ Make sure DNS for $APP_DOMAIN points to this server!${NC}"
echo -e "${YELLOW}  ⚠ If using Cloudflare, set DNS to 'DNS only' (gray cloud) during cert issuance${NC}"
echo ""
read -p "Press Enter when DNS is ready, or Ctrl+C to skip and configure manually later..."

if command -v certbot &> /dev/null; then
    certbot --nginx -d "$APP_DOMAIN" -d "www.${APP_DOMAIN}" --non-interactive --agree-tos --email admin@${APP_DOMAIN} || {
        echo -e "${YELLOW}  ⚠ Certbot failed. You may need to run it manually:${NC}"
        echo "    sudo certbot --nginx -d $APP_DOMAIN -d www.${APP_DOMAIN}"
    }
else
    echo -e "${YELLOW}  ⚠ Certbot not installed. Install it with:${NC}"
    echo "    sudo apt-get install certbot python3-certbot-nginx"
    echo "  Then run:"
    echo "    sudo certbot --nginx -d $APP_DOMAIN -d www.${APP_DOMAIN}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "  1. Edit configuration: ${APP_DIR}/.env"
echo "  2. Add your SingleStore credentials"
echo "  3. Restart the app: sudo -u $APP_USER pm2 restart $APP_NAME"
echo "  4. Check status: sudo -u $APP_USER pm2 status"
echo "  5. View logs: sudo -u $APP_USER pm2 logs $APP_NAME"
echo ""
echo "Useful Commands:"
echo "  - Restart app: sudo -u $APP_USER pm2 restart $APP_NAME"
echo "  - Stop app: sudo -u $APP_USER pm2 stop $APP_NAME"
echo "  - View logs: sudo -u $APP_USER pm2 logs $APP_NAME --lines 100"
echo "  - Test database: cd $APP_DIR && sudo -u $APP_USER node deployment/scripts/test-db.js"
echo ""
echo "Port Usage: $APP_PORT (isolated, no conflicts)"
echo "Domain: $APP_DOMAIN"
echo ""
