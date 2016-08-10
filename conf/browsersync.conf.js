const conf = require('./gulp.conf');

const proxyMiddleware = require('http-proxy-middleware');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      // vucalur: set up proxy to backend:
      middleware: proxyMiddleware('/nemtuRelay', {target: 'http://localhost:8080', changeOrigin: true})
    },
    open: false
  };
};
