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
// Mirrors saveSkill in app/dashboard/actions.js, where text() trims the field first.
const saveSkill = (raw) => {
  const name = String(raw).trim();
  if (!name) return { error: 'Name is required' };
  return { name };
};
assert.deepEqual(saveSkill(''), { error: 'Name is required' });
assert.deepEqual(saveSkill('   '), { error: 'Name is required' });
assert.deepEqual(saveSkill(' JavaScript '), { name: 'JavaScript' });

// Mirrors slug() in components/Skills.js (a JSX module plain node cannot import), pinning the
// devicon mapping the seed relies on. Every slug below was checked against the Iconify API.
const slug = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

for (const [name, expected] of Object.entries({
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  'Next.js': 'nextjs',
  'Node.js': 'nodejs',
  'Tailwind CSS': 'tailwindcss',
  MongoDB: 'mongodb',
  Python: 'python',
  Docker: 'docker',
})) {
  assert.equal(slug(name), expected, `${name} should slugify to ${expected}`);
}

// Names arrive from free-text dashboard input, so slugs ignore case and punctuation.
assert.equal(slug('  NODE.js '), 'nodejs');
assert.equal(slug('C++'), 'c');
// Nothing left after stripping -- the component falls back to a neutral icon for these.
assert.equal(slug('!!!'), '');

// Mirrors ids() in app/dashboard/actions.js. The drag order is a client-supplied string, so it is
// filtered to real ObjectIds before it reaches Prisma and capped at MAX_ORDER.
const OBJECT_ID = /^[0-9a-f]{24}$/i;
const MAX_ORDER = 500;
const ids = (value) =>
  String(value ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => OBJECT_ID.test(id))
    .slice(0, MAX_ORDER);

const a = 'a'.repeat(24);
const b = '0123456789abcdef01234567';
assert.deepEqual(ids(`${a}, ${b}`), [a, b]);
assert.deepEqual(ids(''), []);
assert.deepEqual(ids(undefined), []);
// Anything that is not a bare ObjectId is dropped rather than passed on to the query.
assert.deepEqual(ids(`${a},../../etc/passwd,{"$ne":null},${b};drop`), [a]);
// The cap bounds how many writes one request can queue.
assert.equal(ids(Array.from({ length: MAX_ORDER + 10 }, () => a).join(',')).length, MAX_ORDER);

// Mirrors move() in components/DashboardList.js -- the reorder arithmetic behind every drag and
// arrow-key nudge.
const move = (list, from, to) => {
  const next = [...list];
  const [id] = next.splice(from, 1);
  next.splice(to, 0, id);
  return next;
};

assert.deepEqual(move(['a', 'b', 'c'], 2, 0), ['c', 'a', 'b']);
assert.deepEqual(move(['a', 'b', 'c'], 0, 2), ['b', 'c', 'a']);
assert.deepEqual(move(['a', 'b', 'c'], 1, 1), ['a', 'b', 'c']);
// The source list is never mutated, since the caller keeps it as the revert target.
const source = ['a', 'b', 'c'];
move(source, 0, 2);
assert.deepEqual(source, ['a', 'b', 'c']);

console.log('skills ok');
