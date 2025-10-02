# PartnerSystems Main - VPS Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy `partnersystems_main` to your Ubuntu VPS with complete isolation from existing applications.

## Pre-Deployment Checklist

### 1. VPS Requirements
- Ubuntu 20.04 LTS or newer
- Node.js 18.x or 20.x
- Nginx installed
- PM2 installed globally
- Certbot installed (for SSL)
- At least 1GB free RAM
- Port 3008 available (verified not in use)

### 2. Domain Configuration
- **Domain**: partnersystems.online
- **DNS**: Must point to your VPS IP address
- **Cloudflare**: Set to "DNS Only" (gray cloud) during initial SSL setup
  - After Let's Encrypt certificate is issued, you can enable Cloudflare proxy
  - Set SSL mode to "Full (strict)" in Cloudflare

### 3. SingleStore Database
You must have:
- SingleStore cluster hostname
- Database name
- Username and password
- Port number (usually 3306 or 3333)
- SSL certificate (singlestore_bundle.pem) - already included

### 4. Existing Apps Inventory
The deployment will NOT touch these:
- FreePaper (port 8000)
- Kerit (ports 3001, 3002)
- SmartCover (port 3004)
- TrustLine (port 3003)
- TopTeachers (port 3005)
- PartnerSystems (port 3006)
- SiahRokh (port 3007)

**New app will use port 3008** - guaranteed no conflicts.

---

## Deployment Steps

### Step 1: Upload Application to VPS

```bash
# On your local machine, from the project root:
# Create a tarball excluding unnecessary files
tar -czf partnersystems_main.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  .

# Upload to VPS
scp partnersystems_main.tar.gz root@your-vps-ip:/tmp/

# SSH into VPS
ssh root@your-vps-ip

# Extract
cd /tmp
tar -xzf partnersystems_main.tar.gz -C /root/partnersystems_main_deploy
cd /root/partnersystems_main_deploy
```

### Step 2: Run Deployment Script

```bash
# Make sure you're in the project root directory
cd /root/partnersystems_main_deploy

# Run deployment script (as root)
sudo bash deployment/scripts/deploy.sh
```

The script will:
1. ✓ Create dedicated user `partnersystems_main`
2. ✓ Create isolated directory structure at `/home/partnersystems_main/`
3. ✓ Install dependencies (Node.js, PM2 if needed)
4. ✓ Copy application files
5. ✓ Copy SSL certificate
6. ✓ Create `.env` template
7. ✓ Install npm dependencies
8. ✓ Build the application
9. ✓ Set secure permissions
10. ✓ Configure PM2
11. ✓ Configure Nginx
12. ✓ Setup Let's Encrypt SSL

### Step 3: Configure Database Credentials

```bash
# Edit the environment file
sudo nano /home/partnersystems_main/app/.env
```

**Required Configuration:**
```env
# Application
NODE_ENV=production
PORT=3008

# SingleStore Database - EDIT THESE VALUES
SINGLESTORE_HOST=svc-xxxxx-xxxx.svc.singlestore.com
SINGLESTORE_PORT=3333
SINGLESTORE_USER=your_username
SINGLESTORE_PASSWORD=your_password
SINGLESTORE_DATABASE=your_database

# Session Secret - Generate a random string
SESSION_SECRET=generate_a_long_random_string_here

# Connection Pool (adjust if needed)
DB_POOL_SIZE=10
DB_CONNECTION_TIMEOUT=20000

# SSL Configuration (already set correctly)
SSL_CERT_PATH=/home/partnersystems_main/app/certs/singlestore_bundle.pem
SSL_REJECT_UNAUTHORIZED=true
```

**To generate a secure session secret:**
```bash
openssl rand -base64 32
```

### Step 4: Test Database Connection

```bash
# Test before starting the app
cd /home/partnersystems_main/app
sudo -u partnersystems_main node deployment/scripts/test-db.js
```

Expected output:
```
✓ All required environment variables present
✓ Connection established
✓ Test query successful
✓ Database health check PASSED
```

If the test fails, check:
- Credentials are correct
- VPS IP is whitelisted in SingleStore
- Port and host are correct
- SSL certificate is present

### Step 5: Start the Application

```bash
# Restart with new configuration
sudo -u partnersystems_main pm2 restart partnersystems_main

# Check status
sudo -u partnersystems_main pm2 status

# View logs
sudo -u partnersystems_main pm2 logs partnersystems_main --lines 50
```

### Step 6: Verify Nginx and SSL

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check SSL certificate
sudo certbot certificates | grep partnersystems.online
```

### Step 7: Test the Application

```bash
# From VPS
curl -I http://localhost:3008
# Should return 200 OK

# From browser
https://partnersystems.online
# Should load with valid SSL
```

---

## Post-Deployment Configuration

### Enable Cloudflare Proxy (Optional)

After Let's Encrypt is working:
1. Go to Cloudflare DNS settings
2. Enable proxy (orange cloud) for partnersystems.online
3. Set SSL/TLS mode to "Full (strict)"
4. The app will continue working through Cloudflare

### Firewall Configuration (Recommended)

```bash
# If UFW is not active yet (recommended to enable)
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Updating Database Configuration

When you need to change database settings (credentials, host, pool size):

```bash
# Run the update script
sudo bash /home/partnersystems_main/app/deployment/scripts/update-config.sh
```

This script will:
1. Create a backup of current config
2. Let you edit the .env file
3. Test the new database connection
4. Restart the app if test passes
5. Rollback automatically if test fails

### Manual Update Process

```bash
# 1. Edit configuration
sudo nano /home/partnersystems_main/app/.env

# 2. Test connection
cd /home/partnersystems_main/app
sudo -u partnersystems_main node deployment/scripts/test-db.js

# 3. If test passes, restart
sudo -u partnersystems_main pm2 restart partnersystems_main

# 4. Check logs
sudo -u partnersystems_main pm2 logs partnersystems_main
```

---

## Rollback Procedure

If database configuration changes break the app:

```bash
# Run rollback script
sudo bash /home/partnersystems_main/app/deployment/scripts/rollback.sh
```

This will:
1. Show available backup files
2. Let you select which backup to restore
3. Test the connection
4. Restart the app with restored config

### Manual Rollback

```bash
# List backups
ls -lah /home/partnersystems_main/app/.env.backup.*

# Restore a backup
sudo cp /home/partnersystems_main/app/.env.backup.YYYYMMDD_HHMMSS \
        /home/partnersystems_main/app/.env

# Restart
sudo -u partnersystems_main pm2 restart partnersystems_main
```

---

## Maintenance Commands

### Application Management

```bash
# View status
sudo -u partnersystems_main pm2 status partnersystems_main

# View logs (real-time)
sudo -u partnersystems_main pm2 logs partnersystems_main

# View last 100 log lines
sudo -u partnersystems_main pm2 logs partnersystems_main --lines 100

# Restart
sudo -u partnersystems_main pm2 restart partnersystems_main

# Stop
sudo -u partnersystems_main pm2 stop partnersystems_main

# Start
sudo -u partnersystems_main pm2 start partnersystems_main
```

### Log Files

```bash
# Application logs
tail -f /home/partnersystems_main/logs/out.log
tail -f /home/partnersystems_main/logs/error.log

# Nginx logs
tail -f /var/log/nginx/partnersystems_main_access.log
tail -f /var/log/nginx/partnersystems_main_error.log
```

### Database Health Check

```bash
# Run anytime to verify database connection
cd /home/partnersystems_main/app
sudo -u partnersystems_main node deployment/scripts/test-db.js
```

---

## Troubleshooting

### Issue: App Won't Start

```bash
# Check PM2 logs
sudo -u partnersystems_main pm2 logs partnersystems_main --lines 100

# Check if port is available
sudo netstat -tlnp | grep 3008

# Check environment file
sudo -u partnersystems_main cat /home/partnersystems_main/app/.env
```

### Issue: Database Connection Fails

```bash
# Run health check
cd /home/partnersystems_main/app
sudo -u partnersystems_main node deployment/scripts/test-db.js

# Check SingleStore credentials
# Verify IP whitelist in SingleStore portal
# Test from SingleStore SQL editor
```

### Issue: SSL Certificate Not Working

```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew --dry-run

# If using Cloudflare, ensure "DNS Only" mode during cert issuance
```

### Issue: Nginx Error

```bash
# Test configuration
sudo nginx -t

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: Port Conflict

```bash
# Check what's using port 3008
sudo netstat -tlnp | grep 3008
sudo lsof -i :3008

# If conflict, change port in:
# 1. /home/partnersystems_main/app/.env (PORT=3008)
# 2. /home/partnersystems_main/app/ecosystem.config.cjs
# 3. /etc/nginx/sites-available/partnersystems_main (proxy_pass)
```

---

## Security Notes

1. **User Isolation**: App runs as dedicated `partnersystems_main` user (not root)
2. **File Permissions**: 
   - Home directory: 700 (owner only)
   - .env file: 600 (owner read/write only)
   - SSL cert: 644 (readable)
3. **Database**: SSL/TLS encrypted connection to SingleStore
4. **Web Traffic**: HTTPS only (HTTP redirects to HTTPS)
5. **Session Secret**: Unique, randomly generated

---

## Architecture Summary

```
Internet
    ↓
Cloudflare DNS (optional proxy)
    ↓
VPS (Nginx on port 443)
    ↓
Nginx reverse proxy (SSL termination)
    ↓
Node.js app (127.0.0.1:3008)
    ↓ (SSL encrypted)
External SingleStore Database
```

### File Structure

```
/home/partnersystems_main/
├── app/                              # Application code
│   ├── server/                       # Backend code
│   ├── client/                       # Frontend code
│   ├── shared/                       # Shared schemas
│   ├── certs/                        # SSL certificates
│   │   └── singlestore_bundle.pem
│   ├── deployment/                   # Deployment scripts
│   │   ├── scripts/
│   │   ├── configs/
│   │   └── docs/
│   ├── .env                          # Configuration (secret)
│   ├── ecosystem.config.cjs          # PM2 config
│   └── package.json
└── logs/                             # Application logs
    ├── out.log
    ├── error.log
    └── combined.log
```

### Port Allocation

- **3008**: partnersystems_main (THIS APP)
- 8000: FreePaper
- 3001-3002: Kerit
- 3003: TrustLine
- 3004: SmartCover
- 3005: TopTeachers
- 3006: PartnerSystems
- 3007: SiahRokh

---

## Support & Additional Help

If you encounter issues:

1. Check logs first (PM2, Nginx, application)
2. Run database health check
3. Verify all environment variables are set
4. Check SingleStore portal for connection logs
5. Ensure DNS is propagated (use `dig partnersystems.online`)

---

## Backup & Disaster Recovery

### Configuration Backups

Automatic backups are created:
- `/home/partnersystems_main/app/.env.backup.*` - Before each config change
- Keep at least 3 most recent backups

### Application Backup

```bash
# Create full backup
sudo tar -czf partnersystems_main_backup_$(date +%Y%m%d).tar.gz \
  /home/partnersystems_main/

# Restore from backup (if needed)
sudo tar -xzf partnersystems_main_backup_YYYYMMDD.tar.gz -C /
sudo -u partnersystems_main pm2 restart partnersystems_main
```

### Database Backup

SingleStore handles backups. Check your SingleStore portal for:
- Automatic backups schedule
- Point-in-time recovery options
- Backup retention policy

---

**Deployment Complete!** Your app is now running at https://partnersystems.online with complete isolation from all other apps.
