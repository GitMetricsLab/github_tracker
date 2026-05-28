import { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, CalendarDays, Clock3, History, Mail, ShieldCheck, Sparkles, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const Profile = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { mode } = themeContext;

  const profile = {
    username: "Profile",
    email: "profile@githubtracker.dev",
    joined: "Always available",
    status: "Active",
  };

  const profileCompleteness = 100;

  const quickStats = [
    { label: "Account status", value: "Active", icon: BadgeCheck, tone: "text-emerald-500" },
    { label: "Session", value: "Secure", icon: ShieldCheck, tone: "text-cyan-500" },
    { label: "Profile score", value: `${profileCompleteness}%`, icon: Sparkles, tone: "text-fuchsia-500" },
  ];

  return (
    <div className={`min-h-[calc(100vh-8rem)] w-full overflow-hidden px-4 py-10 ${mode === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`relative overflow-hidden rounded-[2rem] border shadow-2xl ${mode === "dark" ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-slate-200 bg-white"}`}
        >
          <div className="absolute inset-0 opacity-70">
            <div className="absolute -left-12 top-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/80">Account Overview</p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">Your profile dashboard</h1>
                <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
                  Review your profile setup and jump back into tracking without leaving the profile screen.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                <Clock3 className="h-4 w-4" />
                Updated today
              </div>
            </div>
          </div>

          <div className="relative grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div className={`rounded-[1.75rem] border p-6 shadow-sm ${mode === "dark" ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl font-black text-white shadow-lg shadow-cyan-500/20">
                    <UserCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-3xl font-extrabold tracking-tight">{profile.username}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {profile.status}
                      </span>
                    </div>
                    <p className={`${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                      A focused profile page for your GitHub tracking workspace.
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl border px-4 py-3 ${mode === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Profile completeness</p>
                  <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500" style={{ width: `${profileCompleteness}%` }} />
                  </div>
                  <p className="mt-2 text-sm font-semibold">{profileCompleteness}% complete</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className={`rounded-2xl border p-4 ${mode === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="mt-3 break-all text-base font-semibold">{profile.email}</p>
                </div>

                <div className={`rounded-2xl border p-4 ${mode === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    Joined
                  </div>
                  <p className="mt-3 text-base font-semibold">{profile.joined}</p>
                </div>

                <div className={`rounded-2xl border p-4 ${mode === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                    <History className="h-4 w-4" />
                    Account ID
                  </div>
                  <p className="mt-3 break-all text-sm font-semibold text-slate-900 dark:text-slate-100">profile</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div key={stat.label} className={`rounded-2xl border p-4 ${mode === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                          <p className="mt-2 text-lg font-bold">{stat.value}</p>
                        </div>
                        <Icon className={`h-5 w-5 ${stat.tone}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/track" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-transparent px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5">
                  <ArrowRight className="h-4 w-4" />
                  Go to tracker
                </Link>
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className={`rounded-[1.75rem] border p-6 shadow-sm ${mode === "dark" ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">Session summary</h3>
                    <p className={`mt-1 text-sm ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      A quick overview of this profile page.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <dl className="mt-6 space-y-5 text-sm">
                  <div>
                    <dt className={`${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>Session state</dt>
                    <dd className="mt-1 font-semibold text-emerald-500">Ready</dd>
                  </div>
                  <div>
                    <dt className={`${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>Username</dt>
                    <dd className="mt-1 font-semibold">{profile.username}</dd>
                  </div>
                  <div>
                    <dt className={`${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>Email</dt>
                    <dd className="mt-1 break-all font-semibold">{profile.email}</dd>
                  </div>
                  <div>
                    <dt className={`${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>Joined</dt>
                    <dd className="mt-1 font-semibold">{profile.joined}</dd>
                  </div>
                </dl>
              </div>

              <div className={`rounded-[1.75rem] border p-6 shadow-sm ${mode === "dark" ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"}`}>
                <h3 className="text-lg font-bold">Next steps</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <Link to="/contributors" className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50 dark:hover:border-cyan-500/20 dark:hover:bg-white/5">
                    <span>
                      <span className="block font-semibold">Browse contributors</span>
                      <span className={`block text-xs ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>Explore the full contributor directory</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                  </Link>
                  <Link to="/track" className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50 dark:hover:border-cyan-500/20 dark:hover:bg-white/5">
                    <span>
                      <span className="block font-semibold">Open tracker</span>
                      <span className={`block text-xs ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}>Jump straight into issue and PR analytics</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;