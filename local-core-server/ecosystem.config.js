module.exports = {
  apps: [
    {
      name: "aethel-agent",
      script: "command-core/aethel-core/3kig-backend/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        PORT: 3001,
        NODE_ENV: "production"
      }
    }
  ]
};
