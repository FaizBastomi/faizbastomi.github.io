import { isAuthed, dashboardPath } from '~~/server/utils/auth';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const rawSlug = String(query.slug ?? '').replace(/^\/+|\/+$/g, '');
  const secret = dashboardPath();

  // Fails closed with 404 unless query.slug strictly matches the secret dashboard route
  if (!secret || (rawSlug !== secret && rawSlug !== `${secret}/login`)) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  return {
    authed: isAuthed(event),
    isLogin: rawSlug === `${secret}/login`,
    dashboardPath: secret,
  };
});
