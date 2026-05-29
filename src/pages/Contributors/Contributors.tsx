import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Github,
  Users,
  GitPullRequest,
  ArrowRight,
} from "lucide-react";
import { GITHUB_REPO_CONTRIBUTORS_URL } from "../../utils/constants";
import BackToTopButton from "../../components/Backtotop";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

const stats = [
  {
    title: "Contributors",
    value: "30+",
    icon: Users,
  },
  {
    title: "Pull Requests",
    value: "250+",
    icon: GitPullRequest,
  },
  {
    title: "Open Source",
    value: "Community Driven",
    icon: Github,
  },
];

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

const handleCopy = async (contributor: Contributor) => {
  await navigator.clipboard.writeText(contributor.html_url);
  setCopiedId(contributor.id);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get(
          GITHUB_REPO_CONTRIBUTORS_URL
        );

        setContributors(response.data);
      } catch {
        setError("Failed to fetch contributors.");
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-300">
            Loading Contributors...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="px-6 py-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 blur-3xl rounded-full" />

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 w-screen min-h-screen px-6 py-20">

        {/* HERO SECTION */}
        <section className="text-center mb-28 max-w-6xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm mb-6 backdrop-blur-xl">
            <Sparkles className="w-4 h-4" />
            Open Source Community
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent [filter:drop-shadow(0_0_30px_rgba(56,189,248,0.3))]">
              Amazing Contributors
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
            These amazing developers are helping build and improve GitHub Tracker through open-source collaboration and innovation.
          </p>
        </section>

        {/* STATS */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-28">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="
                p-8
                rounded-3xl
                border
                border-slate-200
                dark:border-slate-800
                bg-slate-100/80
                dark:bg-white/5
                backdrop-blur-xl
                text-center
                hover:border-blue-500/50
                dark:hover:border-cyan-400/60
                hover:-translate-y-2
                hover:shadow-lg
                hover:shadow-blue-500/10
                dark:hover:shadow-cyan-500/20
                transition-all
                duration-300
                "
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-blue-500 dark:text-cyan-300" />
                </div>

                <h3 className="text-4xl font-bold mb-2">
                  {stat.title === "Contributors"
                    ? `${contributors.length}+`
                    : stat.value}
                </h3>

                <p className="text-slate-600 dark:text-slate-400">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </section>

        {/* CONTRIBUTORS SECTION */}
        <section className="max-w-7xl mx-auto mb-28">

          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Community Contributors
            </h2>

            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              The incredible developers helping GitHub Tracker grow through collaboration, innovation, and open-source contributions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {contributors.map((contributor) => (
              <a
                key={contributor.id}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                group
                relative
                overflow-hidden
                p-6
                rounded-3xl
                border
                border-slate-200
                dark:border-slate-800
                bg-slate-100/80
                dark:bg-white/5
                backdrop-blur-xl
                hover:border-blue-500/50
                dark:hover:border-cyan-400/60
                hover:-translate-y-2
                hover:shadow-lg
                hover:shadow-blue-500/10
                dark:hover:shadow-cyan-500/20
                transition-all
                duration-300
                "
              >

                {/* GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_40%)]" />

                <div className="relative z-10 flex flex-col items-center text-center">

                  {/* AVATAR */}
                  <div className="relative mb-6">

                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="
                      relative
                      w-24
                      h-24
                      rounded-full
                      border-4
                      border-slate-200
                      dark:border-slate-700
                      group-hover:border-blue-500/50
                      dark:group-hover:border-cyan-400/60
                      transition-all
                      duration-300
                      "
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-1">
                    {contributor.login}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                    {contributor.contributions} contributions
                  </p>

                  <div className="inline-flex px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-700 dark:text-cyan-300 mb-6">
                    Contributor
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-medium hover:scale-105 transition-all duration-300">
                    <Github className="w-4 h-4" />
                    View GitHub
                  </div>

                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-6xl mx-auto text-center">

          <div className="relative overflow-hidden p-10 rounded-3xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-br from-blue-100/70 to-cyan-100/70 dark:from-blue-500/10 dark:to-cyan-500/10 backdrop-blur-xl shadow-sm dark:shadow-none">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_40%)]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Join the Community
              </div>

              <h2 className="text-4xl font-bold mb-5">
                Want to Contribute?
              </h2>

              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                Help improve GitHub Tracker, contribute new features, fix bugs, and become part of our growing open-source community.
              </p>

              <a
                href="https://github.com/GitMetricsLab/github_tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 font-semibold text-white shadow-lg shadow-blue-500/20"
              >
                Start Contributing
                <ArrowRight className="w-5 h-5" />
              </a>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ContributorsPage;