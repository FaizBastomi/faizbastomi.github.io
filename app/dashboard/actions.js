'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { checkPassword, clearAuthCookie, dashboardPath, requireAuth, setAuthCookie } from '@/lib/auth';

// 'use server': every export must be async. Validation returns { error } and never throws --
// production strips the message off anything a server action throws.

const text = (fd, key) => String(fd.get(key) ?? '').trim();

// http(s) only, so an entry can't smuggle a javascript: or data: href onto the page.
// Returns the clean href, or { error } to hand back to the form.
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

const list = (fd, key) =>
  text(fd, key)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

function id(fd) {
  return text(fd, 'id');
}

const OBJECT_ID = /^[0-9a-f]{24}$/i;
const MAX_ORDER = 500;

// The client sends a comma-separated id list, so both halves are untrusted: non-ids are dropped
// rather than reaching Prisma, and the cap keeps a crafted request from queueing endless writes.
const ids = (value) =>
  String(value ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => OBJECT_ID.test(id))
    .slice(0, MAX_ORDER);

// Prisma has no MongoDB transactions, so each row is written in turn; a drag rewrites them all,
// so a half-applied order cannot survive as a state the list can render.
async function reorder(model, values) {
  for (const [position, id] of values.entries()) {
    await prisma[model].update({ where: { id }, data: { position } });
  }
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function reorderSkills(order) {
  await requireAuth();
  await reorder('skill', ids(order));
}

export async function reorderProjects(order) {
  await requireAuth();
  await reorder('project', ids(order));
}

export async function login(formData) {
  if (!checkPassword(text(formData, 'password'))) return { error: 'Wrong password' };
  await setAuthCookie();
  redirect(`/${dashboardPath()}`);
}

export async function logout() {
  await requireAuth();
  await clearAuthCookie();
  redirect(`/${dashboardPath()}/login`);
}

export async function saveSkill(formData) {
  await requireAuth();
  const name = text(formData, 'name');
  if (!name) return { error: 'Name is required' };

  const data = { name };
  const existing = id(formData);

  if (existing) await prisma.skill.update({ where: { id: existing }, data });
  else await prisma.skill.create({ data });

  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function deleteSkill(formData) {
  await requireAuth();
  await prisma.skill.delete({ where: { id: id(formData) } });
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function saveProject(formData) {
  await requireAuth();
  const name = text(formData, 'name');
  if (!name) return { error: 'Name is required' };
  const description = text(formData, 'description');
  if (!description) return { error: 'Description is required' };
  const githubUrl = requireUrl(text(formData, 'githubUrl'));
  if (githubUrl.error) return githubUrl;

  const data = {
    name,
    description,
    image: text(formData, 'image') || null,
    technologies: list(formData, 'technologies'),
    githubUrl,
    archived: formData.get('archived') === 'on',
  };
  const existing = id(formData);

  if (existing) await prisma.project.update({ where: { id: existing }, data });
  else await prisma.project.create({ data });

  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function deleteProject(formData) {
  await requireAuth();
  await prisma.project.delete({ where: { id: id(formData) } });
  revalidatePath('/');
  revalidatePath('/dashboard');
}
