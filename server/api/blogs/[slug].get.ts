import { prisma } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ status: 400, statusText: 'Slug is required' });
  }

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    throw createError({ status: 404, statusText: 'Post not found' });
  }

  return post;
});
