# Quick Start Deployment

## 5-Minute Deployment

### Prerequisites
- Ubuntu VPS with root access
- Domain DNS pointing to VPS
- SingleStore credentials ready

### Steps

```bash
# 1. Upload and extract
scp partnersystems_main.tar.gz root@your-vps:/tmp/
ssh root@your-vps
cd /tmp && tar -xzf partnersystems_main.tar.gz -C /root/deploy
cd /root/deploy

# 2. Deploy
sudo bash deployment/scripts/deploy.sh

# 3. Configure database
sudo nano /home/partnersystems_main/app/.env
# Add your SingleStore credentials

# 4. Test connection
cd /home/partnersystems_main/app
sudo -u partnersystems_main node deployment/scripts/test-db.js

# 5. Restart
sudo -u partnersystems_main pm2 restart partnersystems_main

# 6. Verify
curl -I https://partnersystems.online
```

### Critical Configuration

Edit `/home/partnersystems_main/app/.env`:

```env
SINGLESTORE_HOST=your-host.svc.singlestore.com
SINGLESTORE_PORT=3333
SINGLESTORE_USER=your_user
SINGLESTORE_PASSWORD=your_password
SINGLESTORE_DATABASE=your_database
SESSION_SECRET=$(openssl rand -base64 32)
```

### Common Commands

```bash
# Update config
sudo bash /home/partnersystems_main/app/deployment/scripts/update-config.sh

# View logs
sudo -u partnersystems_main pm2 logs partnersystems_main

# Restart
sudo -u partnersystems_main pm2 restart partnersystems_main

# Health check
cd /home/partnersystems_main/app
sudo -u partnersystems_main node deployment/scripts/test-db.js

# Rollback config
sudo bash /home/partnersystems_main/app/deployment/scripts/rollback.sh
```

### Isolation Guarantee

✓ Dedicated user: `partnersystems_main`  
✓ Dedicated port: `3008`  
✓ Dedicated domain: `partnersystems.online`  
✓ Dedicated logs: `/home/partnersystems_main/logs/`  
✓ Zero impact on existing apps

### Need Help?

See full guide: `deployment/docs/DEPLOYMENT_GUIDE.md`
