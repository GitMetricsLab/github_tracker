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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
    // check bookmark state for this username
    const checkBookmark = async () => {
      if (!username.trim()) return setIsBookmarked(false);
      try {
        const res = await fetch(`${backendUrl}/api/bookmarks`, { credentials: 'include' });
        if (!res.ok) return setIsBookmarked(false);
        const data = await res.json();
        const found = (data.bookmarks || []).some(
          (b: any) => b.githubUsername.toLowerCase() === username.toLowerCase()
        );
        setIsBookmarked(!!found);
      } catch (err) {
        // ignore
      }
    };

    checkBookmark();

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

  const handleAddBookmark = async () => {
    if (!username.trim()) return;
    setBookmarkLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/bookmarks`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUsername: username }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsBookmarked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleRemoveBookmark = async () => {
    if (!username.trim()) return;
    setBookmarkLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/bookmarks/${encodeURIComponent(username)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to remove');
      setIsBookmarked(false);
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const currentEvents = events.slice(0, 10);

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tracking <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mr-3">Refreshes every 30s</p>

          <button
            onClick={isBookmarked ? handleRemoveBookmark : handleAddBookmark}
            disabled={bookmarkLoading}
            title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition ${isBookmarked ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'}`}
          >
            <span className="text-lg">{isBookmarked ? '★' : '☆'}</span>
            <span className="text-sm font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-center">No activity found</p>
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