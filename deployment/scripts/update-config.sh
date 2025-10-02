#!/bin/bash

# Configuration Update Script
# Safely update database settings and restart ONLY the new app
# This script does NOT affect any other running apps

set -e

APP_NAME="partnersystems_main"
APP_USER="partnersystems_main"
APP_DIR="/home/${APP_USER}/app"
ENV_FILE="${APP_DIR}/.env"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "Configuration Update & Restart"
echo "=========================================="
echo ""

# Check if running as root or as the app user
if [ "$EUID" -eq 0 ]; then
    RUN_AS_USER="sudo -u $APP_USER"
    echo "Running as root (will execute commands as $APP_USER)"
else
    if [ "$(whoami)" != "$APP_USER" ]; then
        echo -e "${RED}Error: Must run as root or as $APP_USER${NC}"
        exit 1
    fi
    RUN_AS_USER=""
    echo "Running as $APP_USER"
fi

echo ""
echo -e "${GREEN}Step 1: Checking environment file${NC}"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: .env file not found at $ENV_FILE${NC}"
    exit 1
fi
echo "  ✓ Found: $ENV_FILE"

echo ""
echo -e "${GREEN}Step 2: Creating backup${NC}"
BACKUP_FILE="${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
echo "  ✓ Backup created: $BACKUP_FILE"

echo ""
echo -e "${YELLOW}Opening .env file for editing...${NC}"
echo "Edit your SingleStore credentials, then save and close."
echo ""
read -p "Press Enter to open the editor..."

# Try to use user's preferred editor
if [ -n "$EDITOR" ]; then
    $EDITOR "$ENV_FILE"
elif command -v nano &> /dev/null; then
    nano "$ENV_FILE"
elif command -v vim &> /dev/null; then
    vim "$ENV_FILE"
else
    vi "$ENV_FILE"
fi

echo ""
echo -e "${GREEN}Step 3: Testing database connection${NC}"
cd "$APP_DIR"
$RUN_AS_USER node deployment/scripts/test-db.js || {
    echo ""
    echo -e "${RED}✗ Database connection test failed!${NC}"
    echo ""
    echo "Options:"
    echo "  1. Fix the credentials and try again"
    echo "  2. Restore backup: cp $BACKUP_FILE $ENV_FILE"
    echo ""
    read -p "Do you want to restore the backup? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp "$BACKUP_FILE" "$ENV_FILE"
        echo -e "${GREEN}✓ Backup restored${NC}"
    fi
    exit 1
}

echo ""
echo -e "${GREEN}Step 4: Restarting application${NC}"
$RUN_AS_USER pm2 restart "$APP_NAME"
echo "  ✓ Application restarted"

echo ""
echo -e "${GREEN}Step 5: Checking application status${NC}"
sleep 3
$RUN_AS_USER pm2 status "$APP_NAME"

echo ""
echo "=========================================="
echo -e "${GREEN}Update Complete!${NC}"
echo "=========================================="
echo ""
echo "Your app has been restarted with new configuration."
echo ""
echo "To verify it's working:"
echo "  1. Check logs: $RUN_AS_USER pm2 logs $APP_NAME"
echo "  2. Visit: https://partnersystems.online"
echo ""
echo "Backup location: $BACKUP_FILE"
echo "(Keep this in case you need to rollback)"
echo ""
