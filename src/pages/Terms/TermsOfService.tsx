import React from 'react';
import { FaBalanceScale, FaShieldAlt, FaFileContract, FaEnvelope } from 'react-icons/fa';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-full w-full flex-1 bg-gray-50 transition-colors duration-200 dark:bg-[#0f172a]">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 font-sans text-zinc-600 antialiased dark:text-zinc-400 md:px-12">
        <div className="mb-14 flex flex-col gap-4 border-b border-zinc-200/80 pb-8 dark:border-zinc-800/80 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Terms of Service
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Core usage rules for GitHub Tracker, including acceptable behavior, account responsibility, and service boundaries.
            </p>
          </div>
          <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            <span>v1.0.0</span>
            <span>&bull;</span>
            <span>Updated May 27, 2026</span>
          </div>
        </div>

        <div className="space-y-10">
          <section className="group flex flex-col gap-4 sm:flex-row">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-blue-500 shadow-sm transition-all duration-200 group-hover:border-blue-500/50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <FaBalanceScale className="h-4 w-4" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm leading-7 md:text-base">
                By accessing GitHub Tracker, you agree to use the application in a lawful manner and to respect the platform, GitHub APIs, and any connected services used to render analytics.
              </p>
            </div>
          </section>

          <section className="group flex flex-col gap-4 sm:flex-row">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-emerald-500 shadow-sm transition-all duration-200 group-hover:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <FaShieldAlt className="h-4 w-4" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                2. Responsible Use
              </h2>
              <p className="text-sm leading-7 md:text-base">
                You must not attempt to abuse rate limits, disrupt the service, probe for unauthorized access, or use the app for automated scraping beyond the supported features.
              </p>
            </div>
          </section>

          <section className="group flex flex-col gap-4 sm:flex-row">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-indigo-500 shadow-sm transition-all duration-200 group-hover:border-indigo-500/50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <FaFileContract className="h-4 w-4" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                3. Service Boundaries
              </h2>
              <p className="text-sm leading-7 md:text-base">
                GitHub Tracker provides repository visibility, contributor insights, and community features. Availability depends on upstream APIs, network conditions, and the current deployment environment.
              </p>
            </div>
          </section>

          <section className="group flex flex-col gap-4 sm:flex-row">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-orange-500 shadow-sm transition-all duration-200 group-hover:border-orange-500/50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <FaEnvelope className="h-4 w-4" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                4. Contact
              </h2>
              <p className="text-sm leading-7 md:text-base">
                If you have a question about these terms, use the contact page to reach the project maintainers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
