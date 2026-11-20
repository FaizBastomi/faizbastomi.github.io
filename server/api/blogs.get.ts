import { prisma } from '~~/server/utils/db';

export default defineEventHandler(async () => {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
});
