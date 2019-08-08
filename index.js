const http2 = require("http2");
const proxyquire = require("proxyquire");
const requests = [];

module.exports = {
  get requests() {
    return requests;
  },
  require: modulePath => {
    const stubs = {
      http2: {
        connect: (target, connectionOptions) => {
          const session = http2.connect(target, connectionOptions);
          const originalRequest = session.request;
          session.request = requestHeaders => {
            requests.push(requestHeaders);
            return originalRequest.call(session, requestHeaders);
          };
          return session;
        },
        "@global": true
      }
    };
    const module = proxyquire(modulePath, stubs);
    return module;
  }
};
