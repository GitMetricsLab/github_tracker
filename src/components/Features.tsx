import { BarChart3, Filter, Github, LockKeyhole, MousePointerClick, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Activity summaries",
    description: "See issue, pull request, open, and completed counts before diving into details.",
    accent: "text-blue-600 bg-blue-50 dark:bg-blue-950",
  },
  {
    icon: Filter,
    title: "Fast filtering",
    description: "Filter by state, repository, date range, and title without leaving the dashboard.",
    accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
  },
  {
    icon: MousePointerClick,
    title: "Actionable cards",
    description: "Open matching GitHub items directly from clean, scan-friendly activity cards.",
    accent: "text-violet-600 bg-violet-50 dark:bg-violet-950",
  },
  {
    icon: Users,
    title: "Contributor directory",
    description: "Explore project contributors with search, ranking, and profile links.",
    accent: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950",
  },
  {
    icon: LockKeyhole,
    title: "Session-only token",
    description: "Your GitHub token is used in the browser session to request GitHub API data.",
    accent: "text-rose-600 bg-rose-50 dark:bg-rose-950",
  },
  {
    icon: Github,
    title: "Built for open source",
    description: "Designed around practical maintainer and contributor workflows.",
    accent: "text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-200",
  },
];

const Features = () => {
  return (
    <section id="features" className="w-full bg-white px-6 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Product highlights
          </p>
          <h2 className="mt-2 text-3xl font-black text-gray-950 dark:text-white md:text-4xl">
            A simpler way to understand GitHub activity
          </h2>
          <p className="mt-3 text-lg leading-8 text-gray-600 dark:text-gray-300">
            The interface focuses on the details users actually need while keeping controls
            predictable and quick to scan.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-900"
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-gray-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
