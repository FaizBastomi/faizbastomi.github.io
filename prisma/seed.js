import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    name: 'Personal Portfolio',
    archived: false,
    description: 'A responsive portfolio website built with Next.js and Tailwind CSS',
    image: '/image/web-portfolio.png',
    technologies: ['Next.js', 'Tailwind CSS', 'JavaScript'],
    githubUrl: 'https://github.com/FaizBastomi/faizbastomi.github.io',
  },
  {
    name: 'Discord Bot',
    archived: false,
    description: 'A Discord bot for managing server and providing fun commands',
    image: null,
    technologies: ['TypeScript', 'DiscordJS', 'Node.js', 'SapphireJS'],
    githubUrl: 'https://github.com/FaizBastomi/kaguya-bot',
  },
  {
    name: 'URL Shortener',
    archived: false,
    description: 'A simple URL shortener service',
    image: null,
    technologies: ['Next.js', 'Tailwind CSS', 'MongoDB', 'JavaScript'],
    githubUrl: 'https://github.com/warung-hytam/url-shortener',
  },
  {
    name: 'WhatsApp Bot',
    archived: true,
    description: 'A WhatsApp bot for automating tasks and providing information',
    image: '/image/wbot.png',
    technologies: ['JavaScript', 'Baileys', 'Node.js'],
    githubUrl: 'https://github.com/FaizBastomi/wbot',
  },
];

// Names must slugify to a real devicon (lowercase alphanumerics only) -- components/Skills.js
// derives the icon straight from the name. Keep each entry a single technology.
const skills = [
  { name: 'JavaScript' },
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'Node.js' },
  { name: 'Tailwind CSS' },
  { name: 'MongoDB' },
  { name: 'Python' },
  { name: 'Docker' },
];

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/FaizBastomi',
    handle: '@FaizBastomi',
    icon: 'github',
    position: 0,
    enabled: true,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/faizbastomi',
    handle: 'faizbastomi',
    icon: 'linkedin',
    position: 1,
    enabled: true,
  },
  {
    name: 'X / Twitter',
    url: 'https://x.com/FaizBastomi',
    handle: '@FaizBastomi',
    icon: 'x-twitter',
    position: 2,
    enabled: true,
  },
  {
    name: 'Email',
    url: 'mailto:contact@faizdev.my.id',
    handle: 'contact@faizdev.my.id',
    icon: 'envelope',
    position: 3,
    enabled: true,
  },
];

async function main() {
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.social.deleteMany();
  await prisma.project.createMany({ data: projects });
  await prisma.skill.createMany({ data: skills });
  await prisma.social.createMany({ data: socials });
  console.log(`Seeded ${projects.length} projects, ${skills.length} skills, and ${socials.length} socials`);
}

main().finally(() => prisma.$disconnect());
