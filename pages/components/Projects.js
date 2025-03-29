import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const projectsList = [
  {
    id: 1,
    name: 'Personal Portfolio',
    description: 'A responsive portfolio website built with Next.js and Tailwind CSS',
    image: '/image/web-portfolio.png',
    technologies: ['Next.js', 'Tailwind CSS', 'React'],
    githubUrl: 'https://github.com/FaizBastomi/faizbastomi.github.io',
  },
  {
    id: 2,
    name: 'Discord Bot',
    description: 'A Discord bot for managing server and providing fun commands',
    technologies: ['TypeScript', 'DiscordJS', 'Node.js', 'SapphireJS'],
    githubUrl: 'https://github.com/FaizBastomi/kaguya-bot',
  },
  {
    id: 3,
    name: 'WhatsApp Bot',
    description: 'A WhatsApp bot for automating tasks and providing information',
    image: '/image/wbot.png',
    technologies: ['JavaScript', 'Baileys', 'Node.js'],
    githubUrl: 'https://github.com/FaizBastomi/wbot',
  },
];

export default function Projects() {
  // Sort the projects: items with images first, then items without images
  const sortedProjects = [...projectsList].sort((a, b) => {
    if (a.image && !b.image) return -1;
    if (!a.image && b.image) return 1;
    return 0;
  });

  return (
    <div className="grid auto-rows-auto grid-cols-1 gap-6 md:grid-cols-3">
      {sortedProjects.map((project) => (
        <div
          key={project.id}
          className="overflow-hidden rounded-xl border border-[#89b4fa] bg-[#1e1e2e] transition-all hover:shadow-lg hover:shadow-[#89b4fa]/20"
        >
          <div className="h-52 overflow-hidden">
            {project.image ? (
              <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#313244]">
                <span className="text-lg font-semibold">{project.name}</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-lg font-bold">{project.name}</h3>
            <p className="mb-3 text-sm text-[#858aa0]">{project.description}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="rounded-full bg-[#313244] px-2 py-1 text-xs">
                  {tech}
                </span>
              ))}
            </div>
            <a href={project.githubUrl} className="flex items-center text-sm" target="_blank" rel="noreferrer">
              View Project <FontAwesomeIcon className="ms-1" icon={faArrowUpRightFromSquare} fontSize={12} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
