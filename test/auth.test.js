// Run with: node test/auth.test.js
// Mirrors the crypto in lib/auth.js, which plain node cannot import (`server-only` is a Next alias).
const assert = require('node:assert');
const { createHash, createHmac, timingSafeEqual } = require('node:crypto');

const PASSWORD = 'correct-horse';
const SECRET = 'a'.repeat(64);
const MAX_AGE = 60 * 60 * 24 * 7;

const matches = (a = '', b = '') =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
const checkPassword = (input) => matches(input, PASSWORD);
const sign = (value, secret = SECRET) => createHmac('sha256', secret).update(value).digest('hex');
const createToken = () => {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
};

function verifyToken(token = '', secret = SECRET) {
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !secret) return false;
  if (!matches(sig, sign(exp, secret))) return false;
  return Number(exp) > Date.now();
}

// Password: exact match only.
assert.equal(checkPassword('correct-horse'), true);
assert.equal(checkPassword('correct-horse '), false);
assert.equal(checkPassword(''), false);
assert.equal(checkPassword('wrong'), false);
assert.equal(checkPassword(undefined), false);

// Token round-trip.
const token = createToken();
assert.equal(verifyToken(token), true);

// Tampering with the expiry or the signature invalidates it.
assert.equal(verifyToken(`${Number(token.split('.')[0]) + 100000}.${token.split('.')[1]}`), false);
assert.equal(verifyToken(`${token.split('.')[0]}.deadbeef`), false);
assert.equal(verifyToken('garbage'), false);
assert.equal(verifyToken(''), false);

// A correctly-signed but expired token is rejected.
const past = String(Date.now() - 1000);
assert.equal(verifyToken(`${past}.${sign(past)}`), false);

// Changing the secret invalidates outstanding sessions -- how a rotated DASHBOARD_PATH
// logs everyone out.
assert.equal(verifyToken(token, 'b'.repeat(64)), false);

console.log('auth ok');
