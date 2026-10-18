// The icon name is derived from the skill name, so there is no lookup table to keep in sync.
// An unrecognised name renders blank rather than broken, hence the neutral 'atom' fallback.
const slug = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

// ponytail: fetches raw SVG on the server so the browser needs zero icon API calls at runtime.
async function getIcon(name) {
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

export default async function Skills({ skills }) {
  const items = await Promise.all(
    skills.map(async (skill) => ({
      ...skill,
      svg: await getIcon(skill.name),
    })),
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((skill) => (
        <div
          key={skill.id}
          className="flex flex-col items-center gap-3 rounded-xl border border-[#45475a] bg-[#1e1e2e] px-4 py-6 transition-colors hover:border-[#89b4fa]"
        >
          {/* Decorative -- the skill name sits right beside it, so it is hidden from
              screen readers rather than read out twice. */}
          {skill.svg ? (
            <span
              className="flex h-12 w-12 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: skill.svg }}
            />
          ) : (
            <span className="h-12 w-12" aria-hidden="true" />
          )}
          <span className="text-center text-sm font-medium">{skill.name}</span>
        </div>
      ))}
    </div>
  );
}
