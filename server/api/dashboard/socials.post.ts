import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';
import { validateUrl } from '~~/shared/utils/validation';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  const name = String(body?.name ?? '').trim();
  if (!name) return { error: 'Platform name is required' };

  const rawUrl = String(body?.url ?? '').trim();
  const checkedUrl = validateUrl(rawUrl);
  if (typeof checkedUrl !== 'string' && checkedUrl.error) return checkedUrl;

  const handle = body?.handle ? String(body.handle).trim() : null;
  const icon = body?.icon ? String(body.icon).trim().toLowerCase() : 'link';
  const enabled = body?.enabled !== false;

  const id = body?.id ? String(body.id).trim() : null;

  const data = {
    name,
    url: typeof checkedUrl === 'string' ? checkedUrl : rawUrl,
    handle,
    icon,
    enabled,
  };

  if (id) {
    await prisma.social.update({ where: { id }, data });
  } else {
    // Determine next position
    const count = await prisma.social.count();
    await prisma.social.create({
      data: {
        ...data,
        position: count,
      },
    });
  }

  return { success: true };
});
