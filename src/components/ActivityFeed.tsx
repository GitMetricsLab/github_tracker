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

        const res = await fetch(
          `https://api.github.com/users/${username}/events`
        );
        const data = await res.json();

        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [username]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Activity Feed
      </h2>

      {loading ? (
      <div className="text-center py-6 text-gray-500">
        Fetching recent activity...
        </div>
      ) : events.length === 0 ? (
      <EmptyState
        title="No activity found"
        description="This user has no recent public GitHub activity."
/>
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