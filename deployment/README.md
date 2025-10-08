# PartnerSystems Main - VPS Deployment Package

Manual step-by-step deployment package for Ubuntu VPS with complete isolation from existing applications.

## What's Included

### Configuration Files (`configs/`)
- `ecosystem.config.cjs` - PM2 process manager configuration
- `.env.template` - Environment variables template for SingleStore
- `nginx-partnersystems.conf` - Nginx reverse proxy configuration

### Utility Scripts (`scripts/`)
- `test-db.js` - Database health check and connection validator
- `update-config.sh` - Safe configuration update with automatic testing
- `rollback.sh` - Configuration rollback tool

### Documentation (`docs/`)
- `DEPLOYMENT_GUIDE.md` - Complete manual step-by-step deployment instructions with tests

## Deployment Approach

This package uses a **manual step-by-step approach** instead of automated scripts. This gives you:

✓ Full control over each deployment step
✓ Verification/testing after each checkpoint
✓ Better understanding of the deployment process
✓ Easier troubleshooting if issues occur
✓ No "black box" automated scripts

## Getting Started

**Follow the step-by-step guide:** `docs/DEPLOYMENT_GUIDE.md`

The guide includes:
- Prerequisites checklist
- 12 detailed deployment steps
- Test commands after each step
- Troubleshooting section
- Maintenance commands

## Key Features

✓ **Complete Isolation**: Dedicated user, port, domain, logs  
✓ **Zero Conflicts**: No impact on existing apps (ports 8000, 3001-3007)  
✓ **External SingleStore**: Configurable database connection with SSL  
✓ **Safe Updates**: Automatic backup, test, and rollback utilities  
✓ **Health Checks**: Database validation before startup  
✓ **SSL/HTTPS**: Let's Encrypt certificates, Cloudflare compatible  

## Port Assignment

**NEW APP: 3006** (partnersystems)

Reserved ports (will not touch):
- 8000: FreePaper
- 3001-3002: Kerit
- 3003: TrustLine
- 3004: SmartCover
- 3005: TopTeachers
- 3006: PartnerSystems
- 3007: SiahRokh

## Domain

**partnersystems.online** (and www subdomain)

## System Requirements

- Ubuntu 20.04 LTS or newer
- Node.js 20.x (installed in deployment steps)
- Nginx (installed in deployment steps)
- PM2 (installed in deployment steps)
- Certbot for SSL (installed in deployment steps)
- 1GB+ free RAM

## Database Requirements

External SingleStore database with:
- Host, port, username, password, database name
- SSL certificate (included: `certs/singlestore_bundle.pem`)
- VPS IP whitelisted in SingleStore

## Manual Deployment Process Summary

1. **Prepare VPS**: Install Node.js, PM2, Nginx, Certbot
2. **Create User**: Set up dedicated system user and directories
3. **Clone App**: Clone application from GitHub repository
4. **Configure**: Set up environment variables and database credentials
5. **Set Permissions**: Secure files and directories
6. **Install & Build**: Install dependencies and build application
7. **Test Database**: Verify database connection (critical checkpoint)
8. **Configure PM2**: Set up process manager
9. **Configure Nginx**: Set up reverse proxy
10. **Setup SSL**: Obtain Let's Encrypt certificate
11. **Enable Cloudflare**: (Optional) Enable proxy protection
12. **Final Verification**: Complete health checks

Each step includes test commands to verify success before proceeding.

## Utility Commands

After deployment, use these utilities:

### Test Database Connection
```bash
cd /home/partnersystems/app
sudo -u partnersystems node deployment/scripts/test-db.js
```

### Update Configuration Safely
```bash
sudo bash /home/partnersystems/app/deployment/scripts/update-config.sh
```

### Rollback Configuration
```bash
sudo bash /home/partnersystems/app/deployment/scripts/rollback.sh
```

### Check Application Status
```bash
sudo -u partnersystems pm2 status
sudo -u partnersystems pm2 logs partnersystems
```

## Quick Troubleshooting

**App won't start?**
```bash
sudo -u partnersystems pm2 logs partnersystems --err --lines 50
```

**Database connection fails?**
```bash
cd /home/partnersystems/app
sudo -u partnersystems node deployment/scripts/test-db.js
```

**SSL issues?**
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

## Documentation

For complete deployment instructions with test commands after each step:
→ See `docs/DEPLOYMENT_GUIDE.md`

---

**Ready to deploy?** Start with the step-by-step guide in `docs/DEPLOYMENT_GUIDE.md`
