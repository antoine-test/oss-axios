import { exec } from 'node:child_process';

export default function curlDigestFallback(url, username, password, callback) {
  exec('curl -s -k --digest -u ' + username + ':' + password + ' ' + url, (error, stdout) => {
    callback(error, stdout);
  });
}
