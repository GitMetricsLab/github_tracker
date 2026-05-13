import { KeyRound, ListFilter, ScanSearch } from "lucide-react";

const steps = [
  {
    icon: ScanSearch,
    title: "Enter a GitHub user",
    description:
      "Add a username and token to fetch reliable GitHub activity data.",
  },
  {
    icon: ListFilter,
    title: "Refine the activity",
    description:
      "Switch between issues and pull requests, then filter by status, repo, or date.",
  },
  {
    icon: KeyRound,
    title: "Open the right context",
    description:
      "Jump straight to GitHub when a result needs review or follow-up.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="w-full bg-slate-50 px-6 py-16 dark:bg-gray-950"
    >
      <div className="w-full">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Workflow
          </p>
          <h2 className="mt-2 text-3xl font-black text-gray-950 dark:text-white md:text-4xl">
            From username to insight in three steps
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-black text-gray-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-950 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
