import { ArrowRight, GitPullRequest, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const previewItems = [
  { label: "Open issues", value: "42", tone: "text-emerald-600" },
  { label: "Pull requests", value: "18", tone: "text-blue-600" },
  { label: "Active repos", value: "9", tone: "text-violet-600" },
];

const Hero = () => {
  return (
    <section className="w-full bg-slate-50 px-6 py-14 dark:bg-gray-950 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900 dark:bg-gray-900 dark:text-blue-300">
            <ShieldCheck className="h-4 w-4" />
            Public GitHub insights in one workspace
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-gray-950 dark:text-white md:text-6xl">
            Track contributors, issues, and pull requests faster.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            GitHub Tracker turns profile activity into a clean dashboard for maintainers,
            open-source contributors, and teams who need quick contribution context.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/track"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Search className="h-5 w-5" />
              Start tracking
            </Link>
            <Link
              to="/contributors"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-bold text-gray-800 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-blue-600"
            >
              View contributors
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Dashboard preview
                </p>
                <h2 className="text-xl font-black text-gray-950 dark:text-white">
                  octocat activity
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Live ready
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {previewItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className={`text-2xl font-black ${item.tone}`}>{item.value}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {["Review new UI dashboard", "Fix API rate-limit state", "Improve contributor profile"].map(
                (title, index) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <GitPullRequest className={index === 0 ? "h-5 w-5 text-blue-600" : "h-5 w-5 text-emerald-600"} />
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {title}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                      #{223 + index}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
