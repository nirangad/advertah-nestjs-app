module.exports = {
  apps: [
    {
      name: 'product-listing-api',
      script: 'dist/main.js',
      instances: '2',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3030,
      },
    },
  ],
};
