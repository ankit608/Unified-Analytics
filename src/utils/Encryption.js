import crypto from 'crypto';

export function generateApiKey() {
  const plainKey = crypto.randomBytes(32).toString('hex'); // 64-character key
  const hashedKey = hashApiKey(plainKey);
  return { plainKey, hashedKey };
}

export function hashApiKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex');
}