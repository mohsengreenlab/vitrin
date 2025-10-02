#!/bin/bash

# Rollback Script
# Quickly restore previous database configuration if something goes wrong
# This script ONLY affects partnersystems_main, no other apps

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
echo "Configuration Rollback"
echo "=========================================="
echo ""

# Check if running as root or as the app user
if [ "$EUID" -eq 0 ]; then
    RUN_AS_USER="sudo -u $APP_USER"
else
    if [ "$(whoami)" != "$APP_USER" ]; then
        echo -e "${RED}Error: Must run as root or as $APP_USER${NC}"
        exit 1
    fi
    RUN_AS_USER=""
fi

echo -e "${GREEN}Looking for backup files...${NC}"
echo ""

# Find all backup files
BACKUPS=($(find "$APP_DIR" -name ".env.backup.*" -type f 2>/dev/null | sort -r))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}No backup files found!${NC}"
    echo "Backups should be at: ${APP_DIR}/.env.backup.*"
    exit 1
fi

echo "Found ${#BACKUPS[@]} backup(s):"
echo ""

# List backups with numbers
for i in "${!BACKUPS[@]}"; do
    BACKUP="${BACKUPS[$i]}"
    TIMESTAMP=$(echo "$BACKUP" | grep -oP '\d{8}_\d{6}')
    SIZE=$(ls -lh "$BACKUP" | awk '{print $5}')
    echo "  [$((i+1))] $(basename $BACKUP) - $SIZE"
done

echo ""
read -p "Select backup to restore (1-${#BACKUPS[@]}) or 'q' to quit: " SELECTION

if [ "$SELECTION" = "q" ] || [ "$SELECTION" = "Q" ]; then
    echo "Cancelled."
    exit 0
fi

# Validate selection
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#BACKUPS[@]} ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$((SELECTION-1))]}"

echo ""
echo -e "${YELLOW}Selected backup: $(basename $SELECTED_BACKUP)${NC}"
echo ""

# Show what will be restored
echo "Preview of backup contents:"
echo "---"
grep -E "^(SINGLESTORE_|DB_)" "$SELECTED_BACKUP" | sed 's/PASSWORD=.*/PASSWORD=***hidden***/' || echo "(No database settings found)"
echo "---"
echo ""

read -p "Restore this backup? This will overwrite current .env (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo -e "${GREEN}Step 1: Creating safety backup of current config${NC}"
SAFETY_BACKUP="${ENV_FILE}.before_rollback.$(date +%Y%m%d_%H%M%S)"
cp "$ENV_FILE" "$SAFETY_BACKUP"
echo "  ✓ Current config saved to: $SAFETY_BACKUP"

echo ""
echo -e "${GREEN}Step 2: Restoring backup${NC}"
cp "$SELECTED_BACKUP" "$ENV_FILE"
chmod 600 "$ENV_FILE"
chown "${APP_USER}:${APP_USER}" "$ENV_FILE" 2>/dev/null || true
echo "  ✓ Backup restored"

echo ""
echo -e "${GREEN}Step 3: Testing database connection${NC}"
cd "$APP_DIR"
$RUN_AS_USER node deployment/scripts/test-db.js || {
    echo ""
    echo -e "${RED}✗ Database connection test failed with restored config!${NC}"
    echo ""
    echo "The backup may also have bad credentials."
    echo "You can:"
    echo "  1. Try a different backup"
    echo "  2. Restore pre-rollback config: cp $SAFETY_BACKUP $ENV_FILE"
    echo "  3. Manually edit: nano $ENV_FILE"
    exit 1
}

echo ""
echo -e "${GREEN}Step 4: Restarting application${NC}"
$RUN_AS_USER pm2 restart "$APP_NAME"
echo "  ✓ Application restarted"

echo ""
echo -e "${GREEN}Step 5: Verifying application status${NC}"
sleep 3
$RUN_AS_USER pm2 status "$APP_NAME"

echo ""
echo "=========================================="
echo -e "${GREEN}Rollback Complete!${NC}"
echo "=========================================="
echo ""
echo "Configuration has been restored from backup."
echo ""
echo "Restored from: $(basename $SELECTED_BACKUP)"
echo "Safety backup: $SAFETY_BACKUP"
echo ""
echo "Check logs: $RUN_AS_USER pm2 logs $APP_NAME"
echo ""
