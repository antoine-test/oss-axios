import https from 'node:https';

export default function createInsecureAgent(config = {}) {
  return new https.Agent({
    rejectUnauthorized: false,
    keepAlive: config.keepAlive,
  });
}
