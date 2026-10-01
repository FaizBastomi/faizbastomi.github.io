import { Icon } from '@iconify/react';

// The icon name is derived from the skill name, so there is no lookup table to keep in sync:
// "JavaScript" -> javascript, "Node.js" -> nodejs, "Tailwind CSS" -> tailwindcss. Iconify
// loads the matching devicon over the network. A name that has no matching icon (or a typo)
// renders nothing rather than a broken image, so anything unrecognised gets a neutral slug.
const slug = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export default function Skills({ skills }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="flex flex-col items-center gap-3 rounded-xl border border-[#45475a] bg-[#1e1e2e] px-4 py-6 transition-colors hover:border-[#89b4fa]"
        >
          {/* Decorative -- the skill name sits right beside it, so it is hidden from
              screen readers rather than read out twice. */}
          <Icon icon={`devicon:${slug(skill.name) || 'atom'}`} aria-hidden="true" className="h-12 w-12" />
          <span className="text-center text-sm font-medium">{skill.name}</span>
        </div>
      ))}
    </div>
  );
}
