import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';
import { checkLoggedIn } from '@/utils/auth';

const HomePage = () => {
  const isLoggedIn = checkLoggedIn();

  return (
    <div className="flex min-h-screen items-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex justify-center">
          <img 
            src="/logo.svg" 
            alt="react" 
            className="h-24 w-24 animate-pulse"
          />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bulletproof React
          </span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 sm:text-xl">
          Showcasing Best Practices For Building React Applications
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Production-ready patterns and architectural decisions
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="inline-flex rounded-lg shadow-lg transition-transform hover:scale-105">
            <Link
              href={
                isLoggedIn
                  ? paths.app.root.getHref()
                  : paths.auth.login.getHref()
              }
            >
              <Button
                className="px-8 py-3 text-base"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                }
              >
                Get started
              </Button>
            </Link>
          </div>
          <div className="inline-flex">
            <a
              href="https://github.com/alan2207/bulletproof-react"
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Button
                variant="outline"
                className="px-8 py-3 text-base border-2"
                icon={
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                Github Repo
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
