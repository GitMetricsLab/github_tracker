import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import type { ThemeContextType } from '../context/ThemeContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Bookmark {
    githubUsername: string;
    avatarUrl?: string;
    savedAt?: string;
}

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const themeContext = useContext(ThemeContext) as ThemeContextType;
    const { mode } = themeContext;

    const fetchBookmarks = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${backendUrl}/api/bookmarks`, { credentials: 'include' });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setBookmarks(data.bookmarks || []);
        } catch (err: unknown) {
            setError('Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const handleRemove = async (username: string) => {
        try {
            const res = await fetch(`${backendUrl}/api/bookmarks/${encodeURIComponent(username)}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed');
            setBookmarks((prev) => prev.filter((b) => b.githubUsername.toLowerCase() !== username.toLowerCase()));
        } catch (err) {
            setError('Unable to remove bookmark');
        }
    };

    return (
        <div className="w-full min-h-full p-6 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-center">Saved Bookmarks</h1>

                <div className="rounded-[2rem] border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6 shadow-lg">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : bookmarks.length === 0 ? (
                        <p className="text-center text-gray-600">No bookmarks yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {bookmarks.map((b) => (
                                <li key={b.githubUsername} className="flex items-center justify-between rounded-xl border p-3 bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center gap-3">
                                        <img src={b.avatarUrl || '/crl-icon.png'} alt="avatar" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-semibold">{b.githubUsername}</div>
                                            <div className="text-xs text-gray-500">Saved {b.savedAt ? new Date(b.savedAt).toLocaleString() : ''}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <button onClick={() => handleRemove(b.githubUsername)} className="px-3 py-1 rounded-full bg-red-600 text-white text-sm">
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
