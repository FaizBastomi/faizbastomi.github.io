import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFont, faFontAwesome, faLayerGroup, faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-row items-end justify-between p-3 text-sm">
      <div className="flex flex-col md:flex-row md:gap-x-4">
        <Link
          className="text-[#858aa0] hover:text-[#eba0ac] hover:underline"
          href="https://fonts.google.com/specimen/Plus+Jakarta+Sans"
          target="_blank"
        >
          <FontAwesomeIcon className="me-1" icon={faFont} fontSize={14} />
          Plus Jakarta Sans
        </Link>
        <Link className="text-[#858aa0] hover:text-[#eba0ac] hover:underline" href="https://nextjs.org" target="_blank">
          <FontAwesomeIcon className="me-1" icon={faLayerGroup} fontSize={14} />
          Nextjs
        </Link>
        <Link
          className="text-[#858aa0] hover:text-[#eba0ac] hover:underline"
          href="https://github.com/catppuccin"
          target="_blank"
        >
          <FontAwesomeIcon className="me-1" icon={faPalette} fontSize={14} />
          Catppuccin
        </Link>
        <Link className="text-[#858aa0] hover:text-[#eba0ac] hover:underline" href="https://fontawesome.com" target="_blank">
          <FontAwesomeIcon className="me-1" icon={faFontAwesome} fontSize={14} />
          Fontawesome
        </Link>
      </div>
      <button
        className="text-[#858aa0] hover:text-[#eba0ac]"
        onClick={() => window.open('https://github.com/FaizBastomi/faizbastomi.github.io', '_blank')}
      >
        Clone on Github
        <FontAwesomeIcon className="ms-1" icon={faGithub} fontSize={14} />
      </button>
    </footer>
  );
}
