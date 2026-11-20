import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
});
