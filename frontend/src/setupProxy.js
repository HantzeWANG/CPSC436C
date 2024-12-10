const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: "https://cpsc436c2024group6.com",
      changeOrigin: true,
      secure: true // Enable this for HTTPS
    })
  );
};