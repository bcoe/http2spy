const http2 = require("http2");
const { describe, before, after, it } = require("mocha");
const http2spy = require("../");
const createClient = http2spy.require(require.resolve("./utils/create-client"));

require("chai").should();

const TESTING_PORT = 9999;

describe("http2spy", () => {
  let server;
  before(() => {
    server = http2.createServer();
    server.on("stream", stream => {
      stream.respond({ ":status": 200, "content-type": "text/plain" });
      stream.end("hello world");
    });
    server.listen(TESTING_PORT);
  });
  after(done => {
    server.close(done);
  });

  describe("require", () => {
    it("it captures requests made using client.request", done => {
      const client = createClient(`http://localhost:${TESTING_PORT}`);
      const req = client.request({ ":method": "GET", ":path": "/" });

      let responseHeaders;
      let responseBody = "";
      req.on("response", _responseHeaders => {
        responseHeaders = _responseHeaders;
      });
      req.on("data", chunk => {
        responseBody += chunk.toString("utf8");
      });
      req.on("end", () => {
        client.destroy();
        responseHeaders[":status"].should.equal(200);
        responseBody.should.equal("hello world");
        http2spy.requests[0][":method"].should.equal("GET");
        return done();
      });
    });
  });
});
