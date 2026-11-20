// Run with: node test/blogs.test.js
import assert from 'node:assert';
import { slugify } from '../shared/utils/slug.ts';
import { marked } from 'marked';

// Test slugify utility
assert.equal(slugify('My First Blog Post!'), 'my-first-blog-post');
assert.equal(slugify('  Nuxt 4 & Tailwind CSS v4...  '), 'nuxt-4-tailwind-css-v4');
assert.equal(slugify('Clean-Code_Design: 101'), 'clean-code-design-101');
assert.equal(slugify(''), '');

// Test markdown rendering
const md = '# Hello World\n\nThis is **bold** and *italic*.\n\n> A quote\n\n- Item 1\n- Item 2';
const html = marked.parse(md);

assert.ok(html.includes('<h1>Hello World</h1>'));
assert.ok(html.includes('<strong>bold</strong>'));
assert.ok(html.includes('<em>italic</em>'));
assert.ok(html.includes('<blockquote>'));
assert.ok(html.includes('<ul>'));

console.log('blogs ok');
