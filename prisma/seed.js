const { PrismaClient } = require('@prisma/client');

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

const skills = [
  { name: 'JavaScript', level: 90 },
  { name: 'TypeScript', level: 75 },
  { name: 'React / Next.js', level: 80 },
  { name: 'Node.js', level: 85 },
  { name: 'Tailwind CSS', level: 88 },
  { name: 'MongoDB', level: 70 },
  { name: 'Python', level: 60 },
  { name: 'Docker', level: 55 },
];

async function main() {
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.createMany({ data: projects });
  await prisma.skill.createMany({ data: skills });
  console.log(`Seeded ${projects.length} projects and ${skills.length} skills`);
}

main().finally(() => prisma.$disconnect());
