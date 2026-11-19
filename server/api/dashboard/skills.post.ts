import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);
  const name = String(body?.name ?? '').trim();
  if (!name) return { error: 'Name is required' };

  const id = body?.id ? String(body.id).trim() : null;
  const data = { name };

  if (id) {
    await prisma.skill.update({ where: { id }, data });
  } else {
    await prisma.skill.create({ data });
  }

  return { success: true };
});
