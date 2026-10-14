module.exports = {
  apps: [
    {
      name: "aethel-local-core",
      cwd: __dirname,
      script: "app.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 9999
      }
    }
  ]
};
