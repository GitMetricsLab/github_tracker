import { useEffect, useState } from "react";

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

  // 🕒 time ago function
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
        try {
          setLoading(true);
          setError("");

          const res = await fetch(
            `https://api.github.com/users/${username}/events`
          );

          //  Handle GitHub API rate limit
          if (res.status === 403) {
            const remaining =
              res.headers.get("X-RateLimit-Remaining") || "0";

            const reset =
              res.headers.get("X-RateLimit-Reset");

            const resetTime = reset
              ? new Date(Number(reset) * 1000).toLocaleTimeString()
              : "Unknown";

            setError(
              `GitHub API rate limit exceeded.
               Please try again after ${resetTime}.
               Remaining Requests: ${remaining}`
            );

            setEvents([]);
            setLoading(false);
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to fetch activity");
          }

          const data = await res.json();

          setEvents(data);
        } catch (err) {
          console.error(err);

          setError(
            "Something went wrong while fetching GitHub activity."
          );
        } finally {
          setLoading(false);
        }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [username]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-black dark:text-white">
        Activity Feed
      </h2>
      
      {error && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}


      {loading ? (
        <p className="text-center">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-black dark:text-white">No activity found</p>
      ) : (
        events.slice(0, 10).map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-3 mb-3 shadow-sm bg-white dark:bg-gray-700"
          >
            <p className="text-sm font-semibold">
              {event.type === "PushEvent" && "🚀 Commit pushed"}
              {event.type === "PullRequestEvent" && "🔀 Pull Request"}
              {event.type === "IssuesEvent" && "🐛 Issue"}
              {event.type === "WatchEvent" && "⭐ Starred repo"}
              {![
                "PushEvent",
                "PullRequestEvent",
                "IssuesEvent",
                "WatchEvent",
              ].includes(event.type) && event.type}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {event.repo?.name} • {getTimeAgo(event.created_at)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}