import { prisma } from '~~/server/utils/db';
import { slug } from '~~/shared/utils/slug';

const byOrder = [{ position: 'asc' as const }, { id: 'asc' as const }];

// Fetches raw SVG server-side so client requires zero icon API calls
async function getIcon(name: string) {
  const icon = slug(name) || 'atom';
  try {
    const res = await fetch(`https://api.iconify.design/devicon/${icon}.svg`);
    if (res.ok) return await res.text();
    const fallback = await fetch('https://api.iconify.design/devicon/atom.svg');
    if (fallback.ok) return await fallback.text();
  } catch {
    return null;
  }
}

export default defineEventHandler(async () => {
  const skills = await prisma.skill.findMany({ orderBy: byOrder });
  return Promise.all(
    skills.map(async (skill) => ({
      ...skill,
      svg: await getIcon(skill.name),
    })),
  );
});
