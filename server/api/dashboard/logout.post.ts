import { requireAuth, clearAuthCookie, dashboardPath } from '~~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);
  clearAuthCookie(event);
  return { success: true, redirect: `/${dashboardPath()}/login` };
});
