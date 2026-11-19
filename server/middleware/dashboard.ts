export default defineEventHandler((event) => {
  const path = event.path;
  if (path === '/dashboard' || path.startsWith('/dashboard/') || path.startsWith('/dashboard?')) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
});
