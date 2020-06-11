import * as http2 from 'http2';

export function connect(path: string) {
  return http2.connect(path);
}
