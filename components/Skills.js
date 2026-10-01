// Devicon slugs served straight from Iconify's CDN -- no icon package to install.
// Keyed by the seed names in prisma/seed.js. Lookup is case-insensitive so a skill typed
// as "javascript" or "Node.js" still resolves; unknown names fall back to a neutral slug.
const ICONS = {
  javascript: 'javascript',
  typescript: 'typescript',
  react: 'react',
  'react / next.js': 'nextjs',
  'next.js': 'nextjs',
  nodejs: 'nodejs',
  'node.js': 'nodejs',
  'tailwind css': 'tailwindcss',
  tailwindcss: 'tailwindcss',
  mongodb: 'mongodb',
  python: 'python',
  docker: 'docker',
  github: 'github',
  git: 'git',
  prisma: 'prisma',
  npm: 'npm',
};

const iconFor = (name) => ICONS[String(name).trim().toLowerCase()] ?? 'atom';

export default function Skills({ skills }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="flex flex-col items-center gap-3 rounded-xl border border-[#45475a] bg-[#1e1e2e] px-4 py-6 transition-colors hover:border-[#89b4fa]"
        >
          {/* Decorative: the skill name sits right beside it. Plain <img> -- next/image
              would add a loader and an optimizer step to an already-vector SVG. */}
          <img
            src={`https://api.iconify.design/devicon/${iconFor(skill.name)}.svg`}
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="text-center text-sm font-medium">{skill.name}</span>
        </div>
      ))}
    </div>
  );
}
