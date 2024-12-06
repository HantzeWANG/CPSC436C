const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: "https://cpsc-436-c-git-ci-heroku-biyhw9s-projects.vercel.app",
      changeOrigin: true,
    })
  );
};
