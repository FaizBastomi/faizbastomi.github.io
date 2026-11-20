import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';
import { slugify } from '~~/shared/utils/slug';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  const title = String(body?.title ?? '').trim();
  if (!title) return { error: 'Title is required' };

  const content = String(body?.content ?? '').trim();
  if (!content) return { error: 'Content is required' };

  let postSlug = String(body?.slug ?? '').trim();
  if (!postSlug) {
    postSlug = slugify(title);
  } else {
    postSlug = slugify(postSlug);
  }
  if (!postSlug) return { error: 'Valid slug is required' };

  const description = body?.description ? String(body.description).trim() : null;
  const published = body?.published !== false;

  const id = body?.id ? String(body.id).trim() : null;

  // Check for slug uniqueness against other posts
  const existing = await prisma.post.findUnique({ where: { slug: postSlug } });
  if (existing && existing.id !== id) {
    return { error: 'A post with this slug already exists' };
  }

  const data = {
    title,
    slug: postSlug,
    content,
    description,
    published,
  };

  if (id) {
    await prisma.post.update({ where: { id }, data });
  } else {
    await prisma.post.create({ data });
  }

  return { success: true };
});
