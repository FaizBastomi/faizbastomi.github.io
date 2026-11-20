import { prisma } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/xml');

  let posts: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    posts = [];
  }

  const staticUrls = [{ loc: 'https://faizdev.my.id/', priority: '1.0', changefreq: 'monthly' }];

  const postUrls = posts.map((p) => ({
    loc: `https://faizdev.my.id/blog/${p.slug}`,
    lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : undefined,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allUrls = [...staticUrls, ...postUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;
});
