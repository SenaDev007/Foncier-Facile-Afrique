module.exports = {
  apps: [{
    name: 'foncier-facile-afrique',
    script: 'node',
    args: '.next/standalone/server.js',
    env: { NODE_ENV: 'production', PORT: 3000 },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
  }]
}
