import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';

const byOrder = [{ position: 'asc' as const }, { id: 'asc' as const }];

export default defineEventHandler(async (event) => {
  requireAuth(event);
  return prisma.social.findMany({
    orderBy: byOrder,
  });
});
