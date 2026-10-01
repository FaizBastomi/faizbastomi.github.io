export default function Skills({ skills }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.id}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">{skill.name}</span>
            <span className="text-[#858aa0]">{skill.level}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-[#313244]"
            role="progressbar"
            aria-label={skill.name}
            aria-valuenow={skill.level}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-[#89b4fa]" style={{ width: `${skill.level}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
