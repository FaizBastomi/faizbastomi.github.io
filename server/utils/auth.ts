import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { H3Event } from 'h3';
import { getCookie, setCookie, deleteCookie, createError } from 'h3';

export const COOKIE = 'dash';
export const MAX_AGE = 60 * 60 * 24 * 7;

export const dashboardPath = () => process.env.DASHBOARD_PATH || '';

const matches = (a = '', b = '') =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

const sign = (value: string) =>
  createHmac('sha256', process.env.SESSION_SECRET || '')
    .update(value)
    .digest('hex');

export function checkPassword(input: string) {
  return matches(input, process.env.DASHBOARD_PASSWORD || '');
}

export function createToken() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token = '') {
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !process.env.SESSION_SECRET) return false;
  if (!matches(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

export function isAuthed(event: H3Event) {
  const token = getCookie(event, COOKIE);
  return verifyToken(token);
}

export function setAuthCookie(event: H3Event) {
  const path = dashboardPath() ? `/${dashboardPath()}` : '/';
  setCookie(event, COOKIE, createToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path,
  });
}

export function clearAuthCookie(event: H3Event) {
  const path = dashboardPath() ? `/${dashboardPath()}` : '/';
  deleteCookie(event, COOKIE, { path });
}

export function requireAuth(event: H3Event) {
  if (!isAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
}
