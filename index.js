const http2 = require("http2");
const proxyquire = require("proxyquire");
const requests = [];

module.exports = {
  get requests() {
    return requests;
  },
  require: (modulePath, additionalStubs = {}) => {
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
    return proxyquire(modulePath, Object.assign(additionalStubs, stubs));
  }
};
