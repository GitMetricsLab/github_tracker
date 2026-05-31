import { FormEvent, useState } from "react";
import ActivityFeed from "../components/ActivityFeed";

export default function Activity() {
  const [query, setQuery] = useState("octocat");
  const [trackedUsername, setTrackedUsername] = useState("octocat");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitized = query.trim();
    if (!sanitized) return;
    setTrackedUsername(sanitized);
  };

  return (
    <div className="w-full min-h-full p-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Live GitHub Activity
        </h1>

        <div className="rounded-[2rem] border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6 shadow-lg mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
            Enter any GitHub username below to track recent public activity in real time.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
            <label htmlFor="github-username" className="sr-only">
              GitHub username
            </label>
            <input
              id="github-username"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. octocat"
              className="w-full min-w-0 rounded-3xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Track Activity
            </button>
          </form>
        </div>

        <ActivityFeed username={trackedUsername} />
      </div>
    </div>
  );
}