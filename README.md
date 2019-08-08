# http2spy

Spy on nodejs' built-in [http2 module](https://nodejs.org/api/http2.html) and
assert against requests that have been performed.

```js
const assert = require("assert");
const http2spy = require("http2spy");
const myClient = http2spy.require(require.resolve("./lib/my-client"));

// do something with your http2 API client, e.g., 
// client.request({ ":method": "GET", ":path": "/" });

// now examine the requests;
assert.strictEqual(http2spy.requests[0][":method"], 'GET');
```
