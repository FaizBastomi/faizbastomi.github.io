import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);
  const id = String(body?.id ?? '').trim();
  if (!id) return { error: 'ID is required' };

  await prisma.skill.delete({ where: { id } });
  return { success: true };
});
