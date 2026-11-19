import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';
import { ids } from '~~/shared/utils/validation';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);
  const type = body?.type === 'project' ? 'project' : 'skill';
  const orderedIds = ids(body?.order);

  for (const [position, id] of orderedIds.entries()) {
    if (type === 'project') {
      await prisma.project.update({ where: { id }, data: { position } });
    } else {
      await prisma.skill.update({ where: { id }, data: { position } });
    }
  }

  return { success: true };
});
