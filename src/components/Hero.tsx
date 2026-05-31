import { Search, GitBranch, GitCommit, GitPullRequest, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fixed array declaration for data structure rendering stability
const MATRIX_CELLS = Array.from({ length: 21 }, (_, i) => i);

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white px-6 py-20 lg:py-32 min-h-[90vh] flex items-center transition-colors duration-500">

      {/* 1. Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient Radial Glow Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT COLUMN: Typography & CTA */}
          <div className="lg:col-span-6 text-left space-y-6 max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-slate-100">
              Track GitHub Activity
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent [filter:drop-shadow(0_0_30px_rgba(56,189,248,0.3))]">
                Like Never Before
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Monitor and analyze GitHub user activity with powerful insights. Perfect for developers,
              project managers, and teams who want to understand contribution patterns and repository engagement.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              {/* Interactive Primary Link Button */}
              <Link to='/track' className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-500 dark:via-cyan-400 dark:to-teal-400 text-slate-900 dark:text-white transition-all shadow-md dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] transform hover:-translate-y-0.5">
                <span className="relative px-7 py-3.5 transition-all ease-in duration-75 bg-white dark:bg-[#030712] rounded-[10px] group-hover:bg-opacity-0 flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600 dark:text-cyan-400 group-hover:text-white transition-colors" />
                  <span className="text-slate-900 dark:text-white group-hover:text-white">Start Tracking</span>
                </span>
              </Link>

              <Link
                to="/#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-gray-200 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Explore Features
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Dashboard & Floating Git Elements */}
          <div className="lg:col-span-6 relative flex items-center justify-center h-[400px] md:h-[500px]">

            {/* The Main Dashboard Mockup Card */}
            <div className="relative w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl dark:shadow-cyan-950/20 transform hover:scale-[1.02] transition-transform duration-500 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/60 mb-6">
                <div className="flex items-center space-x-2">
                  <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dashboard Insights</span>
                </div>
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-yellow-500/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500/60"></span>
                </div>
              </div>

              {/* Mockup Data widgets */}
              <div className="space-y-4">
                <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/40">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Weekly Commits</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">176 <span className="text-xs text-emerald-600 dark:text-emerald-400 font-normal ml-1">+12%</span></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 h-full w-[70%] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Simulated GitHub Contribution Grid */}
                <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/40">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Contribution Matrix</div>
                  <div className="grid grid-cols-7 gap-1.5 w-max">
                    {MATRIX_CELLS.map((cellIndex) => {
                      // Fully qualified class names to ensure they aren't removed by Tailwind's compilation process
                      const intensitiesLight = ['bg-slate-200', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-600'];
                      const intensitiesDark = ['dark:bg-slate-800', 'dark:bg-emerald-900/60', 'dark:bg-emerald-700', 'dark:bg-emerald-500', 'dark:bg-emerald-400'];

                      const lightClass = intensitiesLight[cellIndex % intensitiesLight.length];
                      const darkClass = intensitiesDark[cellIndex % intensitiesDark.length];

                      return (
                        <div
                          key={cellIndex}
                          className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:scale-125 ${lightClass} ${darkClass}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Git Icon Nodes using native inline styles for correct staggered delays */}
            <div
              style={{ animationDelay: '0s' }}
              className="absolute -top-4 left-6 md:left-12 bg-white dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-lg z-20 animate-bounce"
            >
              <GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div
              style={{ animationDelay: '1s' }}
              className="absolute bottom-12 left-2 bg-white dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-lg z-20 animate-bounce"
            >
              <GitCommit className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div
              style={{ animationDelay: '0.5s' }}
              className="absolute top-12 right-6 bg-white dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-lg z-20 animate-bounce"
            >
              <GitPullRequest className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>

            {/* Subtle Neon Center Glow */}
            <div className="absolute inset-0 m-auto w-64 h-64 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-[80px] z-0 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;