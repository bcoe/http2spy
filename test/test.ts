import * as http2 from 'http2';
import {describe, before, after, it} from 'mocha';
import * as http2spy from '../src';
import * as cc from './utils/create-client';

const {
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
} = http2.constants;

const clientCreator = http2spy.require<typeof cc>(
  require.resolve('./utils/create-client')
);

require('chai').should();

const TESTING_PORT = 9999;

describe('http2spy', () => {
  let server: http2.Http2Server;
  before(() => {
    server = http2.createServer();
    server.on('stream', stream => {
      stream.respond({':status': 200, 'content-type': 'text/plain'});
      stream.end('hello world');
    });
    server.listen(TESTING_PORT);
  });
  after(done => {
    server.close(done);
  });

  describe('require', () => {
    it('it captures requests made using client.request', done => {
      const client = clientCreator.connect(`http://localhost:${TESTING_PORT}`);
      const req = client.request({
        [HTTP2_HEADER_METHOD]: 'GET',
        [HTTP2_HEADER_PATH]: '/',
      });

      let responseHeaders: http2.OutgoingHttpHeaders;
      let responseBody = '';
      req.on('response', _responseHeaders => {
        responseHeaders = _responseHeaders;
      });
      req.on('data', chunk => {
        responseBody += chunk.toString('utf8');
      });
      req.on('end', () => {
        client.destroy();
        responseHeaders![HTTP2_HEADER_STATUS]!.should.equal(200);
        responseBody.should.equal('hello world');
        http2spy.requests[0][HTTP2_HEADER_METHOD]!.should.equal('GET');
        return done();
      });
    });
  });
});
