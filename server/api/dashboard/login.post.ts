import { checkPassword, setAuthCookie, dashboardPath } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const secret = dashboardPath();
  if (!secret) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const body = await readBody(event);
  const password = String(body?.password ?? '');

  if (!checkPassword(password)) {
    return { error: 'Wrong password' };
  }

  setAuthCookie(event);
  return { success: true, redirect: `/${secret}` };
});
