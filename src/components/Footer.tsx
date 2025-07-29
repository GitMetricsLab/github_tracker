import { FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="py-4 shadow-lg bg-gray-100 dark:bg-gray-800 dark:text-white">
      <div className="container mx-auto text-center px-4">
        <p className="text-sm md:text-base font-medium flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <span>
            Made with ❤️ by{" "}
            <a
              href="https://github.com/mehul-m-prajapati"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Mehul
            </a>
          </span>
          <span className="hidden sm:inline">|</span>
          <a
            href="https://github.com/mehul-m-prajapati/github_tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-gray-300 transition-colors"
          >
            <FaGithub className="h-5 w-5 mr-1" />
            GitHub Tracker
          </a>
        </p>
        <p className="text-xs md:text-sm mt-2 font-semibold">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">GitHub Tracker</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
