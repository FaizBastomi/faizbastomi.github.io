import { requireAuth } from '~~/server/utils/auth';
import { prisma } from '~~/server/utils/db';
import { requireUrl } from '~~/shared/utils/validation';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);
  const name = String(body?.name ?? '').trim();
  if (!name) return { error: 'Name is required' };

  const description = String(body?.description ?? '').trim();
  if (!description) return { error: 'Description is required' };

  const rawUrl = String(body?.githubUrl ?? '').trim();
  const checkedUrl = requireUrl(rawUrl);
  if (typeof checkedUrl !== 'string' && checkedUrl.error) return checkedUrl;

  const technologies = Array.isArray(body?.technologies)
    ? body.technologies
    : String(body?.technologies ?? '')
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);

  const data = {
    name,
    description,
    image: body?.image ? String(body.image).trim() : null,
    technologies,
    githubUrl: typeof checkedUrl === 'string' ? checkedUrl : rawUrl,
    archived: Boolean(body?.archived),
  };

  const id = body?.id ? String(body.id).trim() : null;
  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }

  return { success: true };
});
