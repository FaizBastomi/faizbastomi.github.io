import Head from 'next/head';
import Projects from './components/Projects';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <section
        id="about"
        className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:flex-row md:px-16"
      >
        <div className="flex flex-col items-center text-center md:w-1/2 md:text-left">
          <img src="/image/profile.jpg" alt="Profile" className="mb-6 ml-4 h-24 w-24 rounded-md md:ml-0 md:mt-4 md:hidden" />
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

      <section id="projects" className="flex min-w-full flex-col px-4 py-12 md:px-16">
        <div className="mx-auto min-w-full max-w-5xl">
          <h2 className="mb-8 mt-5 text-center text-3xl font-bold md:text-left md:text-4xl">Projects</h2>
          <Projects />
        </div>
      </section>
    </>
  );
}
