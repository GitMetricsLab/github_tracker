import { useEffect, useState } from "react";

interface EventType {
  id: string;
  type: string;
  created_at: string;
  repo?: {
    name: string;
  };
}

interface FetchError {
  message: string;
  isRateLimited: boolean;
  statusCode?: number;
}

// Custom error class for ActivityFeed errors
class ActivityFeedError extends Error {
  constructor(
    message: string,
    public isRateLimited = false,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ActivityFeedError";
  }
}

// Type guard to validate if data is EventType[]
const isEventTypeArray = (data: unknown): data is EventType[] => {
  if (!Array.isArray(data)) return false;
  return data.every((item) => {
    if (typeof item !== "object" || item === null) return false;

    // Validate required fields
    if (
      typeof item.id !== "string" ||
      typeof item.type !== "string" ||
      typeof item.created_at !== "string"
    ) {
      return false;
    }

    // Validate optional repo field
    if (item.repo !== undefined) {
      if (
        typeof item.repo !== "object" ||
        item.repo === null ||
        typeof item.repo.name !== "string"
      ) {
        return false;
      }
    }

    return true;
  });
};

export default function ActivityFeed({ username }: { username: string }) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FetchError | null>(null);

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
        setError(null);

        const res = await fetch(
          `https://api.github.com/users/${username}/events`
        );

        // ✅ Check HTTP response success
        if (!res.ok) {
          const isRateLimited = res.status === 403;
          const errorData = await res.json().catch(() => ({}));
          const errorMessage =
            typeof errorData === "object" &&
            errorData !== null &&
            "message" in errorData &&
            typeof errorData.message === "string"
              ? errorData.message
              : `HTTP ${res.status}: Failed to fetch events`;

          throw new ActivityFeedError(
            isRateLimited
              ? "GitHub API rate limit exceeded. Try again later."
              : errorMessage,
            isRateLimited,
            res.status
          );
        }

        const data = await res.json();

        // ✅ Validate response structure matches EventType[]
        if (!isEventTypeArray(data)) {
          throw new ActivityFeedError(
            "Invalid API response structure. Expected array of events.",
            false,
            200
          );
        }

        setEvents(data);
      } catch (err) {
        const fetchError: FetchError = {
          message: "Failed to fetch activity. Please try again.",
          isRateLimited: false,
        };

        // Handle ActivityFeedError instances
        if (err instanceof ActivityFeedError) {
          fetchError.message = err.message;
          fetchError.isRateLimited = err.isRateLimited;
          fetchError.statusCode = err.statusCode;
        } else if (err instanceof Error) {
          // Handle generic errors
          fetchError.message = err.message || fetchError.message;
        }

        setError(fetchError);
        console.error("ActivityFeed fetch error:", fetchError);
        setEvents([]);
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
      <h2 className="text-xl font-bold mb-4 text-center">
        Activity Feed
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading activity...</p>
      ) : error ? (
        <div className="border border-red-300 rounded-lg p-4 mb-3 bg-red-50 dark:bg-red-900/20">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            ⚠️ {error.message}
          </p>
          {error.isRateLimited && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              You've hit GitHub's API rate limit. The limit resets in 1 hour.
            </p>
          )}
          {error.statusCode === 404 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              User not found. Please check the username.
            </p>
          )}
        </div>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No activity found</p>
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