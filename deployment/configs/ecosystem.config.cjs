module.exports = {
  apps: [{
    name: 'partnersystems',
    script: 'dist/index.js',
    cwd: '/home/partnersystems/app',
    instances: 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env_file: '/home/partnersystems/app/.env',
    env: {
      NODE_ENV: 'production',
      PORT: 3006
    },
    error_file: '/home/partnersystems/logs/error.log',
    out_file: '/home/partnersystems/logs/out.log',
    log_file: '/home/partnersystems/logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
