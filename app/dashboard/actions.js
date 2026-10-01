'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { checkPassword, clearAuthCookie, dashboardPath, requireAuth, setAuthCookie } from '@/lib/auth';

// Note: this file is 'use server', so every export must be an async function.
// Validation failures throw a plain Error, which the form renders as a message.

const text = (fd, key) => String(fd.get(key) ?? '').trim();

function requireName(value) {
  if (!value) throw new Error('Name is required');
  return value;
}

function requireLevel(value) {
  const level = Number(value);
  if (!Number.isFinite(level)) throw new Error('Level must be a number');
  return Math.min(100, Math.max(0, Math.round(level)));
}

function requireUrl(value) {
  if (!value) throw new Error('GitHub URL is required');
  // Only http(s), so a dashboard entry can't smuggle a javascript: or data: href onto the page.
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('GitHub URL is not a valid URL');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('GitHub URL must start with http(s)://');
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

export async function login(formData) {
  if (!checkPassword(text(formData, 'password'))) throw new Error('Wrong password');
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
  const data = { name: requireName(text(formData, 'name')), level: requireLevel(text(formData, 'level')) };
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
  const data = {
    name: requireName(text(formData, 'name')),
    description: requireName(text(formData, 'description')),
    image: text(formData, 'image') || null,
    technologies: list(formData, 'technologies'),
    githubUrl: requireUrl(text(formData, 'githubUrl')),
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
