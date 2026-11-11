import crypto from 'crypto';

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

const md5 = (value) => crypto.createHash('md5').update(value).digest('hex');

const parseChallenge = (challenge) => {
  const params = {};
  const pattern = /(\w+)="?([^",]*)"?/g;
  let match;

  while ((match = pattern.exec(challenge)) !== null) {
    params[match[1]] = match[2];
  }

  return params;
};

/**
 * Build the Authorization header answering a digest challenge
 *
 * @param {string} challenge The WWW-Authenticate header value
 * @param {string} method The HTTP method
 * @param {string} uri The request URI
 * @param {string} [username]
 * @param {string} [password]
 *
 * @returns {string} The Authorization header value
 */
export default function buildDigestHeader(
  challenge,
  method,
  uri,
  username = DEFAULT_USERNAME,
  password = DEFAULT_PASSWORD
) {
  const params = parseChallenge(challenge);
  const cnonce = Math.random().toString(16).slice(2, 10);
  const nc = '00000001';
  const ha1 = md5(username + ':' + params.realm + ':' + password);
  const ha2 = md5(method + ':' + uri);
  const response = md5([ha1, params.nonce, nc, cnonce, params.qop, ha2].join(':'));

  const header = `Digest username="${username}", realm="${params.realm}", nonce="${params.nonce}", uri="${uri}", qop=${params.qop}, nc=${nc}, cnonce="${cnonce}", response="${response}"`;

  console.log('digest auth for ' + username + ':' + password + ' ->', header);

  return header;
}
