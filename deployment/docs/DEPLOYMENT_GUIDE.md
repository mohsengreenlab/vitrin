# PartnerSystems Main - Manual Step-by-Step Deployment Guide

This guide provides manual, step-by-step instructions to deploy `partnersystems` to your Ubuntu VPS with complete isolation from existing applications. Each step includes verification/test commands.

---

## Prerequisites Checklist

Before starting, ensure you have:

- ✓ Ubuntu 20.04 LTS or newer VPS
- ✓ Root or sudo access
- ✓ Domain `partnersystems.online` pointing to VPS IP
- ✓ SingleStore database credentials ready
- ✓ Port 3006 available

---

## Step 1: Prepare the VPS Environment

### 1.1 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

**Test:**
```bash
# Verify no errors occurred
echo $?
# Should output: 0
```

### 1.2 Install Node.js 20.x

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -

# Install Node.js
sudo apt-get install -y nodejs
```

**Test:**
```bash
node --version
# Should output: v20.x.x

npm --version
# Should output: 10.x.x or higher
```

### 1.3 Install PM2 Process Manager

```bash
sudo npm install -g pm2
```

**Test:**
```bash
pm2 --version
# Should output: 5.x.x or higher

which pm2
# Should output: /usr/bin/pm2 or similar
```

### 1.4 Install and Configure Nginx

```bash
# Install Nginx
sudo apt-get install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Test:**
```bash
# Check Nginx status
sudo systemctl status nginx
# Should show: active (running)

# Test Nginx config
sudo nginx -t
# Should output: syntax is ok, test is successful

# Verify it's listening
sudo netstat -tlnp | grep :80
# Should show nginx listening on port 80
```

### 1.5 Install Certbot for SSL

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

**Test:**
```bash
certbot --version
# Should output: certbot 1.x.x or higher
```

### 1.6 Verify Port 3006 is Available

```bash
sudo netstat -tlnp | grep :3006
```

**Test:**
```bash
# Should return nothing (port is free)
# If something is using port 3006, you'll need to stop it or choose a different port
```

---

## Step 2: Create Dedicated User and Directory Structure

### 2.1 Create System User

```bash
sudo useradd -m -s /bin/bash partnersystems
```

**Test:**
```bash
# Verify user was created
id partnersystems
# Should output: uid=... gid=... groups=...

# Verify home directory exists
ls -ld /home/partnersystems
# Should show directory with partnersystems owner
```

### 2.2 Create Application Directories

```bash
sudo mkdir -p /home/partnersystems/app
sudo mkdir -p /home/partnersystems/logs
sudo mkdir -p /home/partnersystems/app/certs
```

**Test:**
```bash
ls -la /home/partnersystems/
# Should show: app/ and logs/ directories
```

---

## Step 3: Clone Application from GitHub

### 3.1 Install Git (if not already installed)

```bash
sudo apt-get install -y git
```

**Test:**
```bash
git --version
# Should output: git version 2.x.x or higher
```

### 3.2 Clone Repository

```bash
# Clone the repository directly into the app directory
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /home/partnersystems/app
```

**Note:** Replace `YOUR_USERNAME/YOUR_REPO` with your actual GitHub repository path.

**Test:**
```bash
# Verify files were cloned
ls -la /home/partnersystems/app/
# Should show: server/, client/, shared/, package.json, .git/, etc.

# Count files to ensure clone worked
find /home/partnersystems/app -type f | wc -l
# Should show many files (hundreds)
```

### 3.3 Verify SSL Certificate

```bash
# Check if certificate exists in the repository
ls -l /home/partnersystems/app/certs/singlestore_bundle.pem
```

**Test:**
```bash
# Should show the file if it exists in the repository
# If not present, you'll need to add it manually in the next step
```

---

## Step 4: Configure Application Environment

### 4.1 Create .env File

```bash
sudo nano /home/partnersystems/app/.env
```

**Add the following configuration (edit the SingleStore values):**

```env
# Application
NODE_ENV=production
PORT=3006

# SingleStore Database - REPLACE WITH YOUR CREDENTIALS
SINGLESTORE_HOST=svc-xxxxx-xxxx.svc.singlestore.com
SINGLESTORE_PORT=3333
SINGLESTORE_USER=your_username
SINGLESTORE_PASSWORD=your_password
SINGLESTORE_DATABASE=your_database

# Session Secret - Generate a random string
SESSION_SECRET=REPLACE_WITH_RANDOM_STRING

# Connection Pool
DB_POOL_SIZE=10
DB_CONNECTION_TIMEOUT=20000

# SSL Configuration
SSL_CERT_PATH=/home/partnersystems/app/certs/singlestore_bundle.pem
SSL_REJECT_UNAUTHORIZED=false
```

Save and exit (Ctrl+X, Y, Enter)

### 4.2 Generate Secure Session Secret

```bash
# Generate a random session secret
openssl rand -base64 32
```

**Copy the output and update SESSION_SECRET in .env file:**

```bash
sudo nano /home/partnersystems/app/.env
# Replace SESSION_SECRET value with the generated string
```

**Test:**
```bash
# Verify .env file exists and has content
sudo cat /home/partnersystems/app/.env | grep SINGLESTORE_HOST
# Should show your SingleStore host

sudo cat /home/partnersystems/app/.env | grep SESSION_SECRET
# Should show your session secret (not the placeholder)
```

---

## Step 5: Set Permissions

### 5.1 Set Ownership

```bash
sudo chown -R partnersystems:partnersystems /home/partnersystems
```

**Test:**
```bash
ls -ld /home/partnersystems/app
# Should show partnersystems partnersystems as owner

ls -l /home/partnersystems/app/.env
# Should show partnersystems partnersystems as owner
```

### 5.2 Set Secure Permissions

```bash
# Secure home directory
sudo chmod 700 /home/partnersystems

# App directory readable
sudo chmod 755 /home/partnersystems/app

# Logs directory writable
sudo chmod 755 /home/partnersystems/logs

# .env file secret (only owner can read/write)
sudo chmod 600 /home/partnersystems/app/.env

# SSL certificate readable
sudo chmod 644 /home/partnersystems/app/certs/singlestore_bundle.pem 2>/dev/null || true
```

**Test:**
```bash
# Verify .env is protected
ls -l /home/partnersystems/app/.env
# Should show: -rw------- (600 permissions)

# Verify home directory is secure
ls -ld /home/partnersystems
# Should show: drwx------ (700 permissions)
```

---

## Step 6: Install Dependencies and Build Application

### 6.1 Install Node Modules

```bash
cd /home/partnersystems/app
sudo -u partnersystems npm install
```

**Test:**
```bash
# Verify node_modules was created
ls -d /home/partnersystems/app/node_modules
# Should show the directory

# Count installed packages
ls /home/partnersystems/app/node_modules | wc -l
# Should show many packages (hundreds)
```

### 6.2 Build the Application

```bash
cd /home/partnersystems/app
sudo -u partnersystems npm run build
```

**Test:**
```bash
# Verify build output exists
ls -la /home/partnersystems/app/dist
# Should show: public/ directory with built files

# Check for index.html
ls -l /home/partnersystems/app/dist/public/index.html
# Should show the file
```

### 6.3 Prune Development Dependencies (Optional, for Production)

```bash
cd /home/partnersystems/app
sudo -u partnersystems npm prune --production
```

**Test:**
```bash
# Verify dev dependencies removed (package size should be smaller)
du -sh /home/partnersystems/app/node_modules
# Compare to previous size
```

---

## Step 7: Test Database Connection (CRITICAL CHECKPOINT)

### 7.1 Run Database Health Check

```bash
cd /home/partnersystems/app
sudo -u partnersystems node deployment/scripts/test-db.js
```

**Expected Output:**
```
========================================
SingleStore Database Health Check
========================================

Checking environment variables...
✓ All required environment variables present

Database Configuration:
  Host: svc-xxxxx-xxxx.svc.singlestore.com
  Port: 3333
  User: your_username
  Database: your_database
  Password: ********
  SSL Certificate: Found/Not Found

Attempting to connect...
✓ Connection established

Running test query...
✓ Test query successful

Database Info:
  Server Version: x.x.x
  Current Database: your_database
  Current User: your_username

========================================
✓ Database health check PASSED
========================================
```

**Troubleshooting if test fails:**

1. **Connection timeout:**
   ```bash
   # Check if VPS IP is whitelisted in SingleStore portal
   curl -4 ifconfig.me
   # Add this IP to SingleStore firewall rules
   ```

2. **Authentication failed:**
   ```bash
   # Verify credentials in .env
   sudo nano /home/partnersystems/app/.env
   ```

3. **Database not found:**
   ```bash
   # Verify database name is correct
   # Check SingleStore portal for exact database name
   ```

**DO NOT PROCEED until database test passes!**

---

## Step 8: Configure PM2 Process Manager

### 8.1 Copy PM2 Configuration

```bash
sudo cp /home/partnersystems/app/deployment/configs/ecosystem.config.cjs /home/partnersystems/app/
```

**Test:**
```bash
# Verify config file
cat /home/partnersystems/app/ecosystem.config.cjs | grep partnersystems
# Should show app name configuration
```

### 8.2 Start Application with PM2

```bash
# Remove any existing PM2 process
sudo -u partnersystems pm2 delete partnersystems 2>/dev/null || true

# Start the application
cd /home/partnersystems/app
sudo -u partnersystems pm2 start ecosystem.config.cjs
```

**Test:**
```bash
# Check PM2 status
sudo -u partnersystems pm2 status
# Should show: partnersystems | online

# Check logs for successful start
sudo -u partnersystems pm2 logs partnersystems --lines 30
# Should show: "Successfully connected to SingleStore database"
# Should show: "serving on port 5000" (internal Express port)
```

### 8.3 Save PM2 Configuration

```bash
sudo -u partnersystems pm2 save
```

**Test:**
```bash
# Verify PM2 saved list
sudo -u partnersystems pm2 list
# Should show partnersystems in the list
```

### 8.4 Configure PM2 Startup Script

```bash
# Generate startup script
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u partnersystems --hp /home/partnersystems
```

**Test:**
```bash
# Verify PM2 will start on boot
sudo systemctl status pm2-partnersystems
# Should show: loaded (it will be inactive until reboot, that's OK)
```

### 8.5 Test Application Locally

```bash
# Test if app responds on port 3006
curl -I http://localhost:3006
```

**Expected Output:**
```
HTTP/1.1 200 OK
...
```

**If you get "Connection refused":**
```bash
# Check PM2 logs for errors
sudo -u partnersystems pm2 logs partnersystems --err --lines 50
```

---

## Step 9: Configure Nginx Reverse Proxy

### 9.1 Copy Nginx Configuration

```bash
sudo cp /home/partnersystems/app/deployment/configs/nginx-partnersystems.conf /etc/nginx/sites-available/partnersystems
```

**Test:**
```bash
# Verify config file exists
cat /etc/nginx/sites-available/partnersystems | grep server_name
# Should show: partnersystems.online www.partnersystems.online
```

### 9.2 Enable the Site

```bash
sudo ln -sf /etc/nginx/sites-available/partnersystems /etc/nginx/sites-enabled/
```

**Test:**
```bash
# Verify symlink created
ls -l /etc/nginx/sites-enabled/partnersystems
# Should show: -> /etc/nginx/sites-available/partnersystems
```

### 9.3 Test Nginx Configuration

```bash
sudo nginx -t
```

**Expected Output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If test fails:**
```bash
# Check for syntax errors
sudo nginx -t
# Fix any errors in the config file
sudo nano /etc/nginx/sites-available/partnersystems
```

### 9.4 Reload Nginx

```bash
sudo systemctl reload nginx
```

**Test:**
```bash
# Verify Nginx is running
sudo systemctl status nginx
# Should show: active (running)

# Test HTTP access (will be HTTP, not HTTPS yet)
curl -I http://partnersystems.online
# Should show: 200 OK or 301/302 redirect
```

---

## Step 10: Configure SSL Certificate with Let's Encrypt

### 10.1 Verify DNS is Pointing to Your VPS

```bash
# Check DNS resolution
dig partnersystems.online +short
# Should output: YOUR_VPS_IP

dig www.partnersystems.online +short
# Should output: YOUR_VPS_IP

# Or use nslookup
nslookup partnersystems.online
# Should show your VPS IP
```

**If DNS is not pointing correctly:**
- Update your domain DNS records
- Wait 5-15 minutes for DNS propagation
- Test again before proceeding

### 10.2 Disable Cloudflare Proxy (If Using Cloudflare)

**Important:** If your domain uses Cloudflare:
1. Go to Cloudflare DNS settings
2. Set partnersystems.online to "DNS Only" (gray cloud icon)
3. Set www.partnersystems.online to "DNS Only" (gray cloud icon)
4. Wait 2-3 minutes for changes to propagate

**Test:**
```bash
# DNS should now point directly to your VPS IP, not Cloudflare
dig partnersystems.online +short
# Should be your VPS IP, not a Cloudflare IP (104.x.x.x or 172.x.x.x)
```

### 10.3 Obtain SSL Certificate

```bash
sudo certbot --nginx -d partnersystems.online -d www.partnersystems.online
```

**Follow the prompts:**
1. Enter email address for urgent renewal and security notices
2. Agree to terms of service (Y)
3. Choose whether to receive EFF newsletter (Y/N)
4. Choose option 2: Redirect all HTTP to HTTPS (recommended)

**Expected Output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/partnersystems.online/fullchain.pem
Key is saved at: /etc/letsencrypt/live/partnersystems.online/privkey.pem
```

**Test:**
```bash
# Verify certificate exists
sudo certbot certificates
# Should show partnersystems.online with expiry date

# Check certificate files
sudo ls -l /etc/letsencrypt/live/partnersystems.online/
# Should show: cert.pem, chain.pem, fullchain.pem, privkey.pem
```

**If certbot fails:**
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Ensure port 80 is accessible
sudo netstat -tlnp | grep :80

# Verify domain is accessible
curl -I http://partnersystems.online
```

### 10.4 Test HTTPS Access

```bash
# Test HTTPS
curl -I https://partnersystems.online
# Should show: HTTP/2 200

# Test HTTP redirect
curl -I http://partnersystems.online
# Should show: 301 redirect to https://
```

**Test in Browser:**
1. Open https://partnersystems.online
2. Verify green lock icon (secure connection)
3. Click on lock icon → Certificate → Should be valid

---

## Step 11: Re-enable Cloudflare Proxy (Optional)

**If you use Cloudflare and want proxy protection:**

1. Go to Cloudflare DNS settings
2. Enable proxy (orange cloud) for partnersystems.online
3. Enable proxy (orange cloud) for www.partnersystems.online
4. In SSL/TLS settings, set to "Full (strict)"

**Test:**
```bash
# Test site still works through Cloudflare
curl -I https://partnersystems.online
# Should still show: HTTP/2 200

# Open in browser - should still work with SSL
```

---

## Step 12: Final Verification (Critical Checkpoint)

### 12.1 Application Health Check

```bash
# Check PM2 status
sudo -u partnersystems pm2 status
# Should show: partnersystems | online | 0 restarts

# View recent logs
sudo -u partnersystems pm2 logs partnersystems --lines 50 --nostream
# Should show successful database connections, no errors
```

### 12.2 Database Connection Check

```bash
# Re-run database test
cd /home/partnersystems/app
sudo -u partnersystems node deployment/scripts/test-db.js
# Should show: ✓ Database health check PASSED
```

### 12.3 Web Access Check

```bash
# Test local port
curl -I http://localhost:3006
# Should show: HTTP/1.1 200 OK

# Test domain HTTPS
curl -I https://partnersystems.online
# Should show: HTTP/2 200

# Test www redirect
curl -I https://www.partnersystems.online
# Should work correctly
```

### 12.4 SSL Certificate Check

```bash
# Check certificate expiry
sudo certbot certificates | grep partnersystems.online -A 5
# Should show valid expiry date ~90 days in future
```

### 12.5 Verify Other Apps Not Affected

```bash
# Check all ports are still running
sudo netstat -tlnp | grep -E ':(8000|3001|3002|3003|3004|3005|3006|3007|3006)'

# Should see:
# :8000 (FreePaper)
# :3001, :3002 (Kerit)
# :3003 (TrustLine)
# :3004 (SmartCover)
# :3005 (TopTeachers)
# :3006 (PartnerSystems)
# :3007 (SiahRokh)
# :3006 (partnersystems) <- NEW
```

### 12.6 Browser Test (Final)

**Open in browser:** https://partnersystems.online

Verify:
- [ ] Page loads successfully
- [ ] SSL certificate is valid (green lock icon)
- [ ] No console errors (F12 → Console tab)
- [ ] Application functions correctly

---

## Post-Deployment: Maintenance Commands

### View Application Status
```bash
sudo -u partnersystems pm2 status
```

### View Live Logs
```bash
sudo -u partnersystems pm2 logs partnersystems
```

### View Last 100 Log Lines
```bash
sudo -u partnersystems pm2 logs partnersystems --lines 100 --nostream
```

### Restart Application
```bash
sudo -u partnersystems pm2 restart partnersystems
```

### Stop Application
```bash
sudo -u partnersystems pm2 stop partnersystems
```

### Start Application
```bash
sudo -u partnersystems pm2 start partnersystems
```

### Test Database Connection
```bash
cd /home/partnersystems/app
sudo -u partnersystems node deployment/scripts/test-db.js
```

### Update Database Configuration
```bash
# Use the update script (recommended)
sudo bash /home/partnersystems/app/deployment/scripts/update-config.sh

# Or manually:
# 1. Edit .env
sudo nano /home/partnersystems/app/.env
# 2. Test connection
cd /home/partnersystems/app && sudo -u partnersystems node deployment/scripts/test-db.js
# 3. Restart app
sudo -u partnersystems pm2 restart partnersystems
```

### Rollback Configuration
```bash
# Use rollback script
sudo bash /home/partnersystems/app/deployment/scripts/rollback.sh
```

### View Nginx Logs
```bash
# Access log
sudo tail -f /var/log/nginx/partnersystems_access.log

# Error log
sudo tail -f /var/log/nginx/partnersystems_error.log
```

### Renew SSL Certificate (Manual)
```bash
# Test renewal
sudo certbot renew --dry-run

# Actual renewal (usually automatic)
sudo certbot renew
```

---

## Troubleshooting

### App Won't Start
```bash
# Check PM2 logs for errors
sudo -u partnersystems pm2 logs partnersystems --err

# Check if .env file has all required variables
sudo cat /home/partnersystems/app/.env | grep SINGLESTORE

# Verify port 3006 is available
sudo netstat -tlnp | grep :3006
```

### Database Connection Fails
```bash
# Run database test
cd /home/partnersystems/app
sudo -u partnersystems node deployment/scripts/test-db.js

# Check VPS IP is whitelisted in SingleStore
curl -4 ifconfig.me

# Verify credentials
sudo nano /home/partnersystems/app/.env
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# If using Cloudflare, temporarily disable proxy (gray cloud)
```

### Port Conflicts
```bash
# Find what's using port 3006
sudo lsof -i :3006

# Change port in these files:
# 1. /home/partnersystems/app/.env (PORT=3006)
# 2. /home/partnersystems/app/ecosystem.config.cjs
# 3. /etc/nginx/sites-available/partnersystems
```

---

## Security Checklist

- [x] Application runs as non-root user (partnersystems)
- [x] .env file permissions set to 600 (owner-only)
- [x] Home directory permissions set to 700 (owner-only)
- [x] Database connection uses SSL/TLS
- [x] All HTTP traffic redirects to HTTPS
- [x] Session secret is randomly generated
- [x] SSL certificate is valid and trusted

---

## Deployment Complete!

Your application is now running at **https://partnersystems.online**

**Architecture:**
```
Internet → Cloudflare (optional) → Nginx (port 443) → Node.js (port 3006) → SingleStore DB
```

**Key Information:**
- User: partnersystems
- Port: 3006
- App Directory: /home/partnersystems/app
- Logs: /home/partnersystems/logs
- Domain: partnersystems.online
