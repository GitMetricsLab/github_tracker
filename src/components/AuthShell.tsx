import React, { ReactNode } from "react";

type Highlight = {
  title: string;
  description: string;
};

interface AuthShellProps {
  mode: "dark" | "light";
  badge: string;
  title: string;
  subtitle: string;
  highlights: Highlight[];
  children: ReactNode;
  footer: ReactNode;
}

const AuthShell: React.FC<AuthShellProps> = ({ mode, badge, title, subtitle, highlights, children, footer }) => {
  const surfaceClass =
    mode === "dark"
      ? "bg-slate-950 text-white"
      : "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(226,232,240,0.92))] text-slate-900";

  const panelClass =
    mode === "dark"
      ? "border-white/10 bg-white/10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.45)]"
      : "border-slate-200/80 bg-white/85 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.12)]";

  return (
    <div className={`relative min-h-screen overflow-hidden ${surfaceClass}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -left-24 top-12 h-72 w-72 rounded-full blur-3xl ${mode === "dark" ? "bg-cyan-500/15" : "bg-cyan-400/20"}`} />
        <div className={`absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl ${mode === "dark" ? "bg-fuchsia-500/20" : "bg-fuchsia-300/25"}`} />
        <div className={`absolute bottom-0 left-1/4 h-80 w-80 rounded-full blur-3xl ${mode === "dark" ? "bg-indigo-500/15" : "bg-indigo-300/20"}`} />
        <div
          className={`absolute inset-0 opacity-30 ${mode === "dark" ? "bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)]"}`}
          style={{ backgroundSize: "64px 64px" }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="flex items-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              {badge}
            </div>

            <div className="space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-slate-950/20">
                <img src="/crl-icon.png" alt="GitHubTracker logo" className="h-11 w-11 object-contain" />
              </div>
              <div>
                <h1 className={`text-4xl font-semibold tracking-tight sm:text-5xl ${mode === "dark" ? "text-white" : "text-slate-950"}`}>
                  {title}
                </h1>
                <p className={`mt-4 max-w-lg text-base leading-7 sm:text-lg ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div key={highlight.title} className={`rounded-2xl border p-4 backdrop-blur-xl ${panelClass}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300/90">{highlight.title}</p>
                  <p className={`mt-2 text-sm leading-6 ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}>{highlight.description}</p>
                </div>
              ))}
            </div>

            <div className={`rounded-[1.75rem] border p-5 backdrop-blur-xl ${panelClass}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300/90">Why it works</p>
              <div className="mt-4 space-y-3">
                {[
                  "A focused form card keeps the primary action obvious.",
                  "The left panel gives new users a quick reason to continue.",
                  "Responsive spacing keeps the layout balanced on mobile and desktop.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                    <p className={mode === "dark" ? "text-slate-300" : "text-slate-600"}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className={`w-full max-w-lg rounded-[2rem] border p-6 sm:p-8 lg:p-10 ${panelClass}`}>
            {children}
            <div className="mt-8 border-t border-white/10 pt-6">{footer}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthShell;