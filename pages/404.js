import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>
      <div className="flex min-h-screen min-w-full flex-col">
        <div className="flex flex-grow items-center justify-center">
          <h1 className="mr-4 border-r-2 pr-3 text-4xl md:text-6xl">404</h1>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl">This page doesn't exists</h1>
            <Link
              className="text-sm text-[#c6c6c6] hover:cursor-pointer hover:text-[#eba0ac] hover:underline md:text-lg"
              href="/"
            >
              <FontAwesomeIcon className="me-1 md:text-xl" icon={faPersonRunning} fontSize={16} />
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
