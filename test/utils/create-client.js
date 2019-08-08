const http2 = require("http2");

module.exports = path => {
  return http2.connect(path);
};
