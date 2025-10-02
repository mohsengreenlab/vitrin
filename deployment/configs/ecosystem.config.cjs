module.exports = {
  apps: [{
    name: 'partnersystems_main',
    script: 'server/index.js',
    cwd: '/home/partnersystems_main/app',
    instances: 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3008
    },
    error_file: '/home/partnersystems_main/logs/error.log',
    out_file: '/home/partnersystems_main/logs/out.log',
    log_file: '/home/partnersystems_main/logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
