const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: "http://3.97.78.210:8000",
      changeOrigin: true,
    })
  );
};
