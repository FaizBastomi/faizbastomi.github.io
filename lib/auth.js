import 'server-only';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE = 'dash';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const dashboardPath = () => process.env.DASHBOARD_PATH || '';

// Constant-time compare over sha256 digests: same length always, no early exit.
const matches = (a = '', b = '') =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

const sign = (value) => createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('hex');

export function checkPassword(input) {
  return matches(input, process.env.DASHBOARD_PASSWORD);
}

// Stateless token: expiry + HMAC. No session store, no database round-trip.
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

export async function isAuthed() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

export async function setAuthCookie() {
  (await cookies()).set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    // Scoped to the secret path: rotating DASHBOARD_PATH invalidates every session.
    path: `/${dashboardPath()}`,
  });
}

export async function clearAuthCookie() {
  (await cookies()).delete(COOKIE);
}

// The real security boundary. Server actions are POST endpoints reachable directly,
// so each one calls this before touching the database -- the proxy rewrite is only convenience.
export async function requireAuth() {
  if (!(await isAuthed())) redirect(`/${dashboardPath()}/login`);
}
