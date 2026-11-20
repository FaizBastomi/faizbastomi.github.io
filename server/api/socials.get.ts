import { prisma } from '~~/server/utils/db';

const byOrder = [{ position: 'asc' as const }, { id: 'asc' as const }];

export default defineEventHandler(async () => {
  return prisma.social.findMany({
    where: { enabled: true },
    orderBy: byOrder,
  });
});
