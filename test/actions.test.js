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

// Mirrors iconFor() in components/Skills.js (a JSX module plain node cannot import).
// Every slug in the map must be a real devicon, or its tile renders a broken image --
// verified against the Iconify API, since the set is external and can gain icons but not
// silently lose them.
const ICONS = {
  javascript: 'javascript',
  typescript: 'typescript',
  react: 'react',
  'react / next.js': 'nextjs',
  'next.js': 'nextjs',
  nodejs: 'nodejs',
  'node.js': 'nodejs',
  'tailwind css': 'tailwindcss',
  tailwindcss: 'tailwindcss',
  mongodb: 'mongodb',
  python: 'python',
  docker: 'docker',
  github: 'github',
  git: 'git',
  prisma: 'prisma',
  npm: 'npm',
};
const iconFor = (name) => ICONS[String(name).trim().toLowerCase()] ?? 'atom';

const seeded = ['JavaScript', 'TypeScript', 'React / Next.js', 'Node.js', 'Tailwind CSS', 'MongoDB', 'Python', 'Docker'];
for (const name of seeded) {
  assert.notEqual(iconFor(name), 'atom', `${name} has no devicon`);
}
// Names arrive from free-text dashboard input, so matching must ignore case and padding.
assert.equal(iconFor('  NODE.js '), 'nodejs');
assert.equal(iconFor('JavaScript'), 'javascript');
// An unmapped skill still renders, via the fallback.
assert.equal(iconFor('Cobol'), 'atom');

console.log('skills ok');
