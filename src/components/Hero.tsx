import { Search, GitBranch, GitCommit, GitPullRequest, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const MATRIX_CELLS = Array.from({ length: 21 }, (_, i) => i);

const Hero = () => {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-slate-50 px-6 py-12 text-slate-900 transition-colors duration-500 dark:bg-[#030712] dark:text-white sm:py-16 lg:py-20">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_72%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)]" />
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-[120px] pointer-events-none dark:bg-blue-500/10" />
      <div className="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-400/10 blur-[160px] pointer-events-none dark:bg-cyan-500/10" />
      <div className="absolute -bottom-24 left-1/2 h-[220px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-teal-400/10 blur-[90px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-8 xl:gap-12 lg:grid-cols-12">
          <div className="mx-auto max-w-2xl space-y-5 text-left lg:col-span-5 lg:mx-0 lg:pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.8)]" />
              GitHub activity, refined
            </div>

            <div className="space-y-1.5">
              <h1 className="text-4xl font-extrabold tracking-tight leading-[0.92] text-slate-900 sm:text-[3.15rem] xl:text-[4rem] dark:text-slate-100">
                Track GitHub Activity
                <span className="mt-1.5 block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent [filter:drop-shadow(0_0_30px_rgba(56,189,248,0.3))] dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
                  In Real Time
                </span>
              </h1>
            </div>

            <p className="max-w-lg text-base leading-relaxed text-slate-600 md:text-[1.05rem] dark:text-slate-400">
              Track, compare, and review GitHub activity at a glance.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/track" className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 p-0.5 text-sm font-semibold text-slate-900 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:from-blue-500 dark:via-cyan-400 dark:to-teal-400 dark:text-white dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] dark:focus-visible:ring-offset-[#030712]">
                <span className="relative flex items-center space-x-2 rounded-[10px] bg-white px-6 py-3 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-[#030712]">
                  <Search className="h-5 w-5 text-blue-600 transition-colors group-hover:text-white dark:text-cyan-400" />
                  <span className="text-slate-900 group-hover:text-white dark:text-white">Start Tracking</span>
                </span>
              </Link>

              <Link to="/about" className="inline-flex items-center justify-center rounded-xl border border-slate-200/90 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-800/90 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-300 dark:focus-visible:ring-offset-[#030712]">
                Explore Features
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Public API</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">Fast setup</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Multi-user</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">Compare activity</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live insights</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">Track trends</div>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[400px] items-center justify-center lg:col-span-7 md:min-h-[500px] xl:min-h-[560px]">
            <div className="relative z-10 w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white/70 p-4.5 shadow-xl backdrop-blur-xl transition-transform duration-500 hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-2xl dark:shadow-cyan-950/20 sm:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3.5 dark:border-slate-800/60">
                <div className="flex items-center space-x-2">
                  <Layout className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dashboard Insights</span>
                </div>
                <div className="flex space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400 dark:bg-red-500/60"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 dark:bg-yellow-500/60"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400 dark:bg-green-500/60"></span>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="rounded-xl border border-slate-200/60 bg-slate-100/80 p-3.5 dark:border-slate-800/40 dark:bg-slate-950/80">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Weekly Commits</div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      176 <span className="ml-1 text-xs font-normal text-emerald-600 dark:text-emerald-400">+12%</span>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between rounded-xl border border-slate-200/60 bg-slate-100/80 p-3.5 dark:border-slate-800/40 dark:bg-slate-950/80">
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Active Repos</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">24</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                      Updating now
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/60 bg-slate-100/80 p-3.5 dark:border-slate-800/40 dark:bg-slate-950/80">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Contribution Matrix</div>
                  <div className="grid w-max grid-cols-7 gap-1.5">
                    {MATRIX_CELLS.map((cellIndex) => {
                      const intensitiesLight = ['bg-slate-200', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-600'];
                      const intensitiesDark = ['dark:bg-slate-800', 'dark:bg-emerald-900/60', 'dark:bg-emerald-700', 'dark:bg-emerald-500', 'dark:bg-emerald-400'];

                      const lightClass = intensitiesLight[cellIndex % intensitiesLight.length];
                      const darkClass = intensitiesDark[cellIndex % intensitiesDark.length];

                      return (
                        <div
                          key={cellIndex}
                          className={`h-3 w-3 rounded-[2px] transition-all duration-300 hover:scale-125 ${lightClass} ${darkClass}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl border border-slate-200/60 bg-white/75 px-3 py-2.5 text-center shadow-sm dark:border-slate-800/40 dark:bg-slate-950/70">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">8.4k</div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Views</div>
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-white/75 px-3 py-2.5 text-center shadow-sm dark:border-slate-800/40 dark:bg-slate-950/70">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">92%</div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Trend</div>
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-white/75 px-3 py-2.5 text-center shadow-sm dark:border-slate-800/40 dark:bg-slate-950/70">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">38</div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">PRs</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ animationDelay: '0s' }}
              className="absolute -top-4 left-4 z-20 animate-bounce rounded-xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-lg md:left-10"
            >
              <GitBranch className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div
              style={{ animationDelay: '1s' }}
              className="absolute bottom-10 left-0 z-20 animate-bounce rounded-xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-lg"
            >
              <GitCommit className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div
              style={{ animationDelay: '0.5s' }}
              className="absolute top-12 right-2 z-20 animate-bounce rounded-xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-lg"
            >
              <GitPullRequest className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>

            <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px] z-0 pointer-events-none dark:bg-cyan-500/20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;