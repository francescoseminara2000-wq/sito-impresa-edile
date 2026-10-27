// deploy/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'bmg-costruzioni',
      cwd: '/var/www/edilizia/backend',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      error_file: '/root/.pm2/logs/bmg-costruzioni-error.log',
      out_file: '/root/.pm2/logs/bmg-costruzioni-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
