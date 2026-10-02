import { prisma } from '@/lib/db';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';

// Edits should show up on the next request, so never cache this page.
export const dynamic = 'force-dynamic';

// position first, id as the tie-break: rows that were never dragged all sit at 0 and fall back to
// the order they had before the dashboard could reorder them.
const byOrder = [{ position: 'asc' }, { id: 'asc' }];

export default async function Home() {
  const [skills, projects] = await Promise.all([
    prisma.skill.findMany({ orderBy: byOrder }),
    prisma.project.findMany({ orderBy: byOrder }),
  ]);

  return (
    <>
      <section
        id="about"
        className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:flex-row md:px-16"
      >
        <div className="flex flex-col items-center text-center md:w-1/2 md:text-left">
          <img src="/image/profile.jpg" alt="Profile" className="mb-6 ml-4 h-24 w-24 rounded-md md:mt-4 md:ml-0 md:hidden" />
          <div className="items-center">
            <h1 className="text-3xl font-bold md:text-6xl">Faiz Bastomi</h1>
            <p className="mt-6 max-w-md text-base text-[#858aa0] md:text-lg">
              Welcome to my personal website where I showcase my projects and interests in open source, anime, and technology.
            </p>
          </div>
        </div>
        <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center">
          <img src="/image/profile.jpg" alt="Hero Image" className="max-h-screen w-1/2 rounded-md object-cover" />
        </div>
      </section>

      <section id="skills" className="flex min-w-full flex-col px-4 py-12 md:px-16">
        <div className="mx-auto max-w-5xl min-w-full">
          <h2 className="mt-5 mb-8 text-center text-3xl font-bold md:text-left md:text-4xl">Skills</h2>
          <Skills skills={skills} />
        </div>
      </section>

      <section id="projects" className="flex min-w-full flex-col px-4 py-12 md:px-16">
        <div className="mx-auto max-w-5xl min-w-full">
          <h2 className="mt-5 mb-8 text-center text-3xl font-bold md:text-left md:text-4xl">Projects</h2>
          <Projects projects={projects} />
        </div>
      </section>
    </>
  );
}
