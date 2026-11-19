import { isAuthed, dashboardPath } from '~~/server/utils/auth';

export default defineEventHandler((event) => {
  return {
    authed: isAuthed(event),
    dashboardPath: dashboardPath(),
  };
});
