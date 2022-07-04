const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    createProxyMiddleware(['/chat'], {
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': 'api',
      },
    })
  );
};
