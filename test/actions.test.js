// Run with: node test/actions.test.js
// requireUrl is mirrored from app/dashboard/actions.js, which is a 'use server' module and
// cannot be imported from plain node.
const assert = require('node:assert');

function requireUrl(value) {
  if (!value) return { error: 'GitHub URL is required' };
  let url;
  try {
    url = new URL(value);
  } catch {
    return { error: 'GitHub URL is not a valid URL' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { error: 'GitHub URL must start with http(s)://' };
  return url.href;
}

// A valid http(s) URL comes back as a plain string with no error key.
assert.equal(requireUrl('https://github.com/faizbastomi'), 'https://github.com/faizbastomi');
assert.equal(requireUrl('http://github.com/x').error, undefined);

// Every rejection carries a message and none of them are a throw. Inputs arrive trimmed
// by text(), so whitespace is not one of requireUrl's cases.
for (const [input, expected] of [
  ['', 'GitHub URL is required'],
  ['not a url', 'GitHub URL is not a valid URL'],
  ['github.com/x', 'GitHub URL is not a valid URL'],
  ['javascript:alert(1)', 'GitHub URL must start with http(s)://'],
  ['data:text/html,<script>', 'GitHub URL must start with http(s)://'],
  ['file:///etc/passwd', 'GitHub URL must start with http(s)://'],
]) {
  const result = requireUrl(input);
  assert.equal(result.error, expected, `for input ${JSON.stringify(input)}`);
}

// Save actions reject the same way: a returned { error }, never a throw.
const saveSkill = (name, level) => {
  if (!name) return { error: 'Name is required' };
  const n = Number(level);
  if (!level || !Number.isFinite(n)) return { error: 'Level must be a number' };
  return { name, level: Math.min(100, Math.max(0, Math.round(n))) };
};
assert.deepEqual(saveSkill('', '50'), { error: 'Name is required' });
assert.deepEqual(saveSkill('a', 'abc'), { error: 'Level must be a number' });
// A cleared number input must not land as 0 -- Number('') is 0.
assert.deepEqual(saveSkill('a', ''), { error: 'Level must be a number' });
assert.deepEqual(saveSkill('a', '150'), { name: 'a', level: 100 });
assert.deepEqual(saveSkill('a', '-1'), { name: 'a', level: 0 });
assert.deepEqual(saveSkill('a', '50.4'), { name: 'a', level: 50 });

console.log('actions ok');
