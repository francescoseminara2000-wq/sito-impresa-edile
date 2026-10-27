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
        PORT: 3001,
      },
      error_file: '/var/log/pm2/edilpregio-error.log',
      out_file: '/var/log/pm2/edilpregio-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
