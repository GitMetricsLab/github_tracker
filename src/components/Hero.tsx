import { Search, GitBranch, GitCommit, GitPullRequest, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const MATRIX_CELLS = Array.from({ length: 21 }, (_, i) => i);

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white px-6 py-16 md:py-20 lg:py-24 flex items-center transition-colors duration-500">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Glow Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          {/* LEFT SIDE */}
          <div className="space-y-7 text-center lg:text-left">
            
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
              Track GitHub Activity
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Monitor and analyze GitHub user activity with powerful insights.
              Perfect for developers, project managers, and teams who want to
              understand contribution patterns and repository engagement.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link
                to="/track"
                className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 text-white transition-all shadow-lg hover:scale-105 duration-300"
              >
                <span className="relative px-7 py-3.5 bg-white dark:bg-[#030712] rounded-[10px] flex items-center gap-2 group-hover:bg-transparent transition-all duration-300">
                  <Search className="h-5 w-5 text-blue-600 dark:text-cyan-400 group-hover:text-white" />
                  <span className="text-slate-900 dark:text-white group-hover:text-white">
                    Start Tracking
                  </span>
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center items-center">
            
            {/* Dashboard Card */}
            <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">
                    Dashboard Insights
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-5">

                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Weekly Commits
                  </div>

                  <div className="text-2xl font-bold">
                    176
                    <span className="ml-2 text-sm text-emerald-500">
                      +12%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full w-[70%] rounded-full"></div>
                  </div>
                </div>

                {/* Contribution Grid */}
                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">
                    Contribution Matrix
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 w-max">
                    {MATRIX_CELLS.map((cellIndex) => {
                      const intensities = [
                        'bg-slate-200 dark:bg-slate-800',
                        'bg-emerald-200 dark:bg-emerald-900/60',
                        'bg-emerald-300 dark:bg-emerald-700',
                        'bg-emerald-500',
                        'bg-emerald-600',
                      ];

                      return (
                        <div
                          key={cellIndex}
                          className={`w-3 h-3 rounded-[2px] hover:scale-125 transition-all duration-300 ${
                            intensities[cellIndex % intensities.length]
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Icons */}
            <div className="absolute top-0 left-10 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg animate-bounce">
              <GitBranch className="w-6 h-6 text-blue-500" />
            </div>

            <div
              className="absolute bottom-10 left-0 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg animate-bounce"
              style={{ animationDelay: '1s' }}
            >
              <GitCommit className="w-6 h-6 text-emerald-500" />
            </div>

            <div
              className="absolute top-14 right-4 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg animate-bounce"
              style={{ animationDelay: '0.5s' }}
            >
              <GitPullRequest className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;