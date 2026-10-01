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

// Mirrors slug() in components/Skills.js (a JSX module plain node cannot import).
// Skill names become devicon slugs directly, so this pins the mapping the seed relies on.
// Every slug below was checked against the Iconify API; a name that slugifies to something
// with no icon renders blank, which is why the seed avoids compound names like "React / Next.js".
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

console.log('skills ok');
