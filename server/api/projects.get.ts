import { prisma } from '~~/server/utils/db';

const byOrder = [{ position: 'asc' as const }, { id: 'asc' as const }];

export default defineEventHandler(async () => {
  return prisma.project.findMany({ orderBy: byOrder });
});
