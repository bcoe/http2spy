# http2spy

[![Build Status](https://travis-ci.org/bcoe/http2spy.svg?branch=master)](https://travis-ci.org/bcoe/http2spy)
[![Coverage Status](https://coveralls.io/repos/github/bcoe/http2spy/badge.svg?branch=master)](https://coveralls.io/github/bcoe/http2spy?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


Spy on nodejs' built-in [http2 module](https://nodejs.org/api/http2.html) and
assert against requests that have been performed:

```js
const assert = require("assert");
const http2spy = require("http2spy");
const myClient = http2spy.require(require.resolve("./lib/my-client"));

// do something with your http2 API client, e.g.,
// client.request({ ":method": "GET", ":path": "/" });

// now examine the requests:
assert.strictEqual(http2spy.requests[0][":method"], 'GET');
```

## Passing Additional Stubs

http2spy is just a thin wrapper on top of
[proxyquire](https://www.npmjs.com/package/proxyquire), if you would like to
pass additional libraries to stub, simply provide them as a second parameter:

```js
const myClient = http2spy.require(require.resolve("./lib/my-client"), {
  'second-library': {
    foo: () => {}
  }
});
```

## License

Apache Version 2.0

