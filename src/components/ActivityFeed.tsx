import { useEffect, useState } from "react";
import EmptyState from "./EmptyState";
interface EventType {
  id: string;
  type: string;
  created_at: string;
  repo?: {
    name: string;
  };
}

export default function ActivityFeed({ username }: { username: string }) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTimeAgo = (dateString: string) => {
    const diff = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 1000
    );

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!username.trim()) {
        setEvents([]);
        setError("Please enter a GitHub username to get started.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://api.github.com/users/${username}/events`
        );

        if (!res.ok) {
          let message = "Unable to load activity. Please try again.";
          if (res.status === 404) {
            message = "GitHub user not found. Please check the username.";
          } else if (res.status === 403) {
            message =
              "GitHub rate limit exceeded. Wait a moment and try again.";
          }
          setEvents([]);
          setError(message);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          setError("Unexpected response from GitHub. Please try again.");
          setEvents([]);
          setLoading(false);
          return;
        }

        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch activity. Check your connection and try again.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [username]);

  const currentEvents = events.slice(0, 10);

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tracking <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
          Refreshes every 30s
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-dashed border-indigo-300 bg-indigo-50/70 p-6 text-center text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-950/40 dark:text-indigo-200">
          Loading GitHub activity...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-600/40 dark:bg-red-950/20 dark:text-red-200">
          {error}
        </div>
      ) : currentEvents.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          No recent public activity found for this user.
        </div>
      ) : (
        <div className="space-y-3">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {event.type === "PushEvent" && "🚀 Commit pushed"}
                {event.type === "PullRequestEvent" && "🔀 Pull request event"}
                {event.type === "IssuesEvent" && "🐛 Issue event"}
                {event.type === "WatchEvent" && "⭐ Starred repository"}
                {![
                  "PushEvent",
                  "PullRequestEvent",
                  "IssuesEvent",
                  "WatchEvent",
                ].includes(event.type) && event.type}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {event.repo?.name || "Unknown repository"} • {getTimeAgo(event.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}