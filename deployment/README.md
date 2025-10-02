# PartnerSystems Main - VPS Deployment Package

Complete deployment package for Ubuntu VPS with full isolation from existing applications.

## What's Included

### Configuration Files (`configs/`)
- `ecosystem.config.cjs` - PM2 process manager configuration
- `.env.template` - Environment variables template for SingleStore
- `nginx-partnersystems.conf` - Nginx reverse proxy configuration

### Scripts (`scripts/`)
- `deploy.sh` - Main deployment script (run once)
- `test-db.js` - Database health check and connection validator
- `update-config.sh` - Safe configuration update with automatic testing
- `rollback.sh` - Configuration rollback tool

### Documentation (`docs/`)
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step deployment instructions
- `QUICK_START.md` - Fast 5-minute deployment guide

## Quick Links

- **First Time Setup**: See `docs/DEPLOYMENT_GUIDE.md`
- **Fast Deployment**: See `docs/QUICK_START.md`
- **Update Database Config**: Run `scripts/update-config.sh`
- **Rollback Changes**: Run `scripts/rollback.sh`
- **Test Database**: Run `scripts/test-db.js`

## Key Features

✓ **Complete Isolation**: Dedicated user, port, domain, logs  
✓ **Zero Conflicts**: No impact on existing apps (ports 8000, 3001-3007)  
✓ **External SingleStore**: Configurable database connection with SSL  
✓ **Safe Updates**: Automatic backup, test, and rollback  
✓ **Health Checks**: Database validation before startup  
✓ **SSL/HTTPS**: Let's Encrypt certificates, Cloudflare compatible  

## Port Assignment

**NEW APP: 3008** (partnersystems_main)

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
- Node.js 18.x or 20.x
- Nginx
- PM2
- Certbot (for SSL)
- 1GB+ free RAM

## Database Requirements

External SingleStore database with:
- Host, port, username, password, database name
- SSL certificate (included: `certs/singlestore_bundle.pem`)
- VPS IP whitelisted in SingleStore

## Deployment Process

1. **Upload**: Copy package to VPS
2. **Deploy**: Run `deployment/scripts/deploy.sh`
3. **Configure**: Edit `.env` with SingleStore credentials
4. **Test**: Run database health check
5. **Start**: Restart PM2 service
6. **Verify**: Check logs and access website

## Support

For detailed instructions, troubleshooting, and maintenance:
→ See `docs/DEPLOYMENT_GUIDE.md`

For quick deployment:
→ See `docs/QUICK_START.md`

---

**Ready to deploy?** Start with `docs/DEPLOYMENT_GUIDE.md`
