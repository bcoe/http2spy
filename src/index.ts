import * as http2 from 'http2';
import * as proxyquire from 'proxyquire';

export const requests: http2.OutgoingHttpHeaders[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function req<T = any>(modulePath: string, additionalStubs = {}): T {
  const stubs = {
    http2: {
      connect: (
        target: string,
        connectionOptions:
          | http2.ClientSessionOptions
          | http2.SecureClientSessionOptions
      ) => {
        const session = http2.connect(target, connectionOptions);
        const originalRequest = session.request;
        session.request = requestHeaders => {
          requests.push(requestHeaders!);
          return originalRequest.call(session, requestHeaders);
        };
        return session;
      },
      '@global': true,
    },
  };
  return proxyquire(modulePath, Object.assign(additionalStubs, stubs));
}

export {req as require};
