// deploy/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'edilpregio-api',
      cwd: '/var/www/edilizia/backend',
      script: 'dist/index.js',
      instances: 'max', // Sfrutta tutti i core della VPS IONOS (o 1/2 in base al piano VPS)
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      error_file: '/root/.pm2/logs/edilpregio-error.log',
      out_file: '/root/.pm2/logs/edilpregio-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
