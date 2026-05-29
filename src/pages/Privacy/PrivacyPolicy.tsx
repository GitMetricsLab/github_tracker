import React from 'react';
import { 
  FaShieldAlt, FaKey, FaDatabase, FaUserCheck, FaCheckCircle, 
  FaLock, FaClock, FaShareAlt, FaCookieBite, FaChild 
} from 'react-icons/fa';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col items-stretch bg-gray-50 dark:bg-[#0f172a] min-h-full transition-colors duration-200 self-stretch">
      
      {/* Centered Document Core Container */}
      <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-16 text-zinc-600 dark:text-zinc-400 font-sans antialiased selection:bg-blue-500/20">
        
        {/* Header Area */}
        <div className="mb-14 pb-8 border-b border-zinc-200/80 dark:border-zinc-800/80 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Comprehensive disclosure regarding data scopes, OAuth lifecycle protocols, and compliance frameworks.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 w-fit shrink-0">
            <span>v1.1.0</span>
            <span>&bull;</span>
            <span>Updated May 23, 2026</span>
          </div>
        </div>

        {/* Document Sections */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-blue-500 border border-zinc-200 dark:border-zinc-800 group-hover:border-blue-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaDatabase className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  1. Information Architecture & Granular Scope
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Our GitHub Tracker system interfaces dynamically via encrypted requests using official GitHub REST and GraphQL v4 API structures. When authorizing our application, the platform requests specific parameters categorized into distinct transactional boundaries:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/30 flex items-start gap-3 shadow-sm">
                    <FaCheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Public Personas & Identity</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">Unique GitHub account numbers, alphanumeric handles, public email registries, display names, avatar image URLs, and explicit organizational memberships.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/30 flex items-start gap-3 shadow-sm">
                    <FaCheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Repository Metadata</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">Repository naming schemes, fork/star status parameters, pull request records, timeline branches, file alteration schemas, and lines of code changed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-purple-500 border border-zinc-200 dark:border-zinc-800 group-hover:border-purple-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaShieldAlt className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  2. Data Integrity & Processing Framework
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Your tracking details are captured strictly to fulfill runtime chart mappings, contribution breakdowns, and metric visualizations within your dashboard component stack. We operate on a strict data minimization protocol:
                </p>
                <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/20 text-sm italic text-zinc-500 dark:text-zinc-400">
                  "No raw underlying source code contents, software structural logic matrices, or code blobs are ever read, indexed, parsed, or transferred beyond your current transient client session execution."
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-emerald-500 border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaKey className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  3. Access Control, OAuth Scopes & Token Management
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Authentication OAuth variables are kept isolated inside client-side cross-site safe state blocks or managed through backend encryption protocols using advanced environment keys. Tokens hold restricted, read-only permissions mapping strictly to the interfaces you use.
                </p>
                <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 text-sm flex items-start gap-3">
                  <FaLock className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-xs md:text-sm leading-6">
                    <strong>Total Sovereignty:</strong> You can break application scope permissions instantly at any point. Simply head over to your personal GitHub settings page under <code className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 text-rose-500 dark:text-rose-400 font-mono text-xs rounded border border-zinc-200 dark:border-zinc-700">Settings &rarr; Authorized OAuth Apps</code> and execute "Revoke Access".
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 (NEW) */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-indigo-500 border border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaClock className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  4. Data Retention Windows
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  We match our data lifecycles with the minimal window needed to calculate tracker outputs. Transient API query results are kept inside system short-term cache loops to prevent hitting rate limits against GitHub's infrastructure.
                </p>
                <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  If you manually unbind your profile or close your application tracking dashboard, all temporary caches connected with your profile identity scope are dropped automatically within 24 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 (NEW) */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-orange-500 border border-zinc-200 dark:border-zinc-800 group-hover:border-orange-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaShareAlt className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  5. Third-Party Infrastructure Sub-Processors
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  We do not lease or exchange analytical summaries with commercial ad engines. To deliver this platform service safely, operations traverse specific cloud infrastructure subprocessors:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-zinc-500 dark:text-zinc-400 pl-2">
                  <li><strong className="text-zinc-700 dark:text-zinc-300">GitHub Inc:</strong> Primary provider of identity verification mechanisms and the source repository API layer.</li>
                  <li><strong className="text-zinc-700 dark:text-zinc-300">Cloud Web Hosting (e.g., Vercel/Render):</strong> Delivers static code distribution structures and secure frontend client runtime routing instances.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 (NEW) */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-yellow-600 border border-zinc-200 dark:border-zinc-800 group-hover:border-yellow-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaCookieBite className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  6. Cookies & Local Storage Variables
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Our service does not embed tracking pixels or analytical cookie scripts designed to catalog off-site interactions. We utilize standard browser <code className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 text-amber-500 font-mono text-xs rounded border border-zinc-200 dark:border-zinc-700">LocalStorage</code> and state variables strictly to preserve state parameters:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm pl-2">
                  <li>Theme state configurations (Syncing dark/light toggles securely).</li>
                  <li>Active session routing indices (Preventing drop-offs when running complex repository lookups).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 (NEW) */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-pink-500 border border-zinc-200 dark:border-zinc-800 group-hover:border-pink-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaChild className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  7. Age Restrictions & Children's Privacy
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Our telemetry tools are structured for developers, open-source engineers, and software project maintainers. We do not intentionally harvest account vectors or profile tracking traces from users under the age of 13. If any minor submits profile identifiers, we will purge those traces from short-term memory setups immediately upon notification.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="group relative">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-900/80 text-amber-500 border border-zinc-200 dark:border-zinc-800 group-hover:border-amber-500/50 group-hover:shadow-sm transition-all duration-200">
                <FaUserCheck className="h-4 w-4" />
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  8. Your Rights, GDPR & Cache Control
                </h2>
                <p className="text-sm md:text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Under strict modern global privacy framework mandates (including GDPR and CCPA standardizations), you retain unconditional control over your data metrics. For explicit token cache flush requests, structural transparency audits, or operational logging inquiries, you are invited to launch an official issue ticket inside our repository project workspace.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Support Action Card */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-900/50 dark:to-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Have questions regarding data encryption limits?
            </h4>
            <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-500">
              Our active community engineers are standing by to review repository processing flows.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl shadow-sm hover:shadow-md shadow-blue-500/10 shrink-0"
          >
            Contact Support Team
          </a>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;