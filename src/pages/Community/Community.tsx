import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import type { ThemeContextType } from "../../context/ThemeContext";
import {
  ArrowUpRight,
  Heart,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  PencilLine,
  X,
  MessagesSquare,
} from "lucide-react";

const apiBase = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

type DiscussionComment = {
  id: string;
  text: string;
  author: { id: string; name: string };
  createdAt: string;
};

type Discussion = {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  author: { id: string; name: string };
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
  canEdit: boolean;
  comments: DiscussionComment[];
  createdAt: string;
  updatedAt: string;
};

type DiscussionFormState = {
  title: string;
  body: string;
  category: string;
  tags: string;
};

const categoryPresets = ["All", "Open Source", "Ideas", "Help", "Showcase", "Tools", "Career", "Other"];

const emptyFormState: DiscussionFormState = {
  title: "",
  body: "",
  category: "Open Source",
  tags: "",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const stripTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const firstValidationError = error.response?.data?.errors?.[0]?.message;
  return firstValidationError || error.response?.data?.message || fallback;
};

export default function Community() {
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [categories, setCategories] = useState<string[]>(categoryPresets.slice(1));
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortMode, setSortMode] = useState<"recent" | "trending">("trending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [form, setForm] = useState<DiscussionFormState>(emptyFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const filteredDiscussions = useMemo(() => discussions, [discussions]);

  const trendingDiscussions = useMemo(
    () => [...filteredDiscussions]
      .sort((left, right) => {
        const leftScore = left.likesCount * 2 + left.commentsCount;
        const rightScore = right.likesCount * 2 + right.commentsCount;
        return rightScore - leftScore;
      })
      .slice(0, 3),
    [filteredDiscussions]
  );

  const loadDiscussions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(`${apiBase}/api/discussions`, {
        params: {
          search: debouncedSearch,
          category: selectedCategory === "All" ? "" : selectedCategory,
          sort: sortMode,
        },
        withCredentials: true,
      });

      setDiscussions(response.data.items || []);
      setCategories(response.data.categories?.length ? response.data.categories : categoryPresets.slice(1));
      setIsAuthenticated(!!response.data.isAuthenticated);
    } catch (requestError) {
      setError("Unable to load community discussions right now.");
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, sortMode]);

  useEffect(() => {
    void loadDiscussions();
  }, [loadDiscussions]);

  const resetForm = () => {
    setForm(emptyFormState);
    setEditingId(null);
  };

  const populateForEdit = (discussion: Discussion) => {
    setForm({
      title: discussion.title,
      body: discussion.body,
      category: discussion.category,
      tags: discussion.tags.join(", "),
    });
    setEditingId(discussion.id);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const tags = stripTags(form.tags);
    if (tags.length > 6) {
      setMessage("Use up to 6 tags per discussion.");
      setIsSubmitting(false);
      return;
    }

    if (tags.some((tag) => tag.length > 30)) {
      setMessage("Each tag must be 30 characters or fewer.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category.trim(),
      tags,
    };

    try {
      const response = editingId
        ? await axios.put(`${apiBase}/api/discussions/${editingId}`, payload, { withCredentials: true })
        : await axios.post(`${apiBase}/api/discussions`, payload, { withCredentials: true });

      setMessage(response.data.message || "Saved successfully");
      resetForm();
      await loadDiscussions();
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setIsAuthenticated(false);
        setMessage("Sign in to create and manage discussions.");
        return;
      }

      setMessage(getApiErrorMessage(requestError, "Unable to save discussion."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (discussionId: string) => {
    try {
      await axios.delete(`${apiBase}/api/discussions/${discussionId}`, { withCredentials: true });
      await loadDiscussions();
      setMessage("Discussion deleted.");
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setIsAuthenticated(false);
        setMessage("Sign in to delete your discussion.");
        return;
      }
      setMessage("Unable to delete discussion.");
    }
  };

  const handleLike = async (discussionId: string) => {
    try {
      await axios.post(`${apiBase}/api/discussions/${discussionId}/likes`, {}, { withCredentials: true });
      await loadDiscussions();
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setIsAuthenticated(false);
        setMessage("Sign in to like discussions.");
        return;
      }
      setMessage("Unable to update like state.");
    }
  };

  const handleComment = async (discussionId: string) => {
    const commentText = commentDrafts[discussionId]?.trim();
    if (!commentText || commentText.length < 2) {
      setMessage("Comment must be at least 2 characters long.");
      return;
    }

    if (commentText.length > 1000) {
      setMessage("Comment must be at most 1000 characters long.");
      return;
    }

    try {
      await axios.post(
        `${apiBase}/api/discussions/${discussionId}/comments`,
        { text: commentText },
        { withCredentials: true }
      );
      setCommentDrafts((current) => ({ ...current, [discussionId]: "" }));
      await loadDiscussions();
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setIsAuthenticated(false);
        setMessage("Sign in to comment on discussions.");
        return;
      }
      setMessage(getApiErrorMessage(requestError, "Unable to add comment."));
    }
  };

  const heroTitle = mode === "dark" ? "text-white" : "text-slate-950";
  const heroCopy = mode === "dark" ? "text-slate-300" : "text-slate-600";
  const shell = mode === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-950";

  return (
    <div className={`w-full min-h-screen ${shell} relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-32 left-8 h-72 w-72 rounded-full blur-3xl ${mode === "dark" ? "bg-cyan-500/15" : "bg-cyan-300/25"}`} />
        <div className={`absolute top-48 right-0 h-96 w-96 rounded-full blur-3xl ${mode === "dark" ? "bg-indigo-500/15" : "bg-indigo-300/25"}`} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/70 p-6 shadow-2xl backdrop-blur-xl dark:bg-slate-900/70">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Community Discussions
              </span>
              <h1 className={`mt-4 text-4xl font-black tracking-tight sm:text-5xl ${heroTitle}`}>
                Build ideas, ask questions, and ship together.
              </h1>
              <p className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${heroCopy}`}>
                A dedicated space for GitHub community conversations, product feedback, open-source questions,
                and developer collaboration.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[340px] lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Posts</p>
                <p className="mt-2 text-2xl font-bold">{discussions.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Trending</p>
                <p className="mt-2 text-2xl font-bold">{trendingDiscussions.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Categories</p>
                <p className="mt-2 text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-slate-950"
            >
              <ShieldCheck className="h-4 w-4" />
              Sign in to post
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Authenticated users can create, edit, delete, like, and comment.
            </span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/80 p-5 shadow-xl backdrop-blur-xl dark:bg-slate-900/80">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Discussion feed</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Search, filter, and follow the most active conversations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSortMode("trending")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${sortMode === "trending" ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                  >
                    Trending
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortMode("recent")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${sortMode === "recent" ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                  >
                    Recent
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  <Search className="h-4 w-4" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search discussions, tags, or categories"
                    aria-label="Search discussions, tags, or categories"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    aria-label="Filter by category"
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  >
                    {["All", ...categories.filter((category) => category !== "All")].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categoryPresets.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? null : (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
                You can read discussions without signing in, but posting, editing, commenting, and liking require a logged-in session.
              </div>
            )}

            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-3xl border border-cyan-200 bg-cyan-50 px-5 py-4 text-cyan-900 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">
                {message}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:bg-slate-900/90">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{editingId ? "Edit discussion" : "Create a discussion"}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Share ideas, ask questions, or start a thread around a repository or technology.
                  </p>
                </div>

                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4">
                <input
                  required
                  minLength={4}
                  maxLength={140}
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Discussion title"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950"
                />

                <textarea
                  required
                  rows={6}
                  minLength={20}
                  maxLength={4000}
                  value={form.body}
                  onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                  placeholder="Describe your idea, question, or repository topic..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950"
                />

                <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                  <input
                    required
                    minLength={2}
                    maxLength={60}
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    placeholder="Category"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950"
                  />

                  <input
                    value={form.tags}
                    onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                    placeholder="Tags, separated by commas"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : editingId ? "Update discussion" : "Publish discussion"}
                </button>
              </div>
            </form>

            <div className="space-y-5">
              {isLoading ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/90 p-6 text-center text-slate-500 shadow-xl dark:bg-slate-900/90 dark:text-slate-400">
                  Loading community feed...
                </div>
              ) : discussions.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500 shadow-xl dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                  No discussions found. Start the first thread in this category.
                </div>
              ) : (
                discussions.map((discussion) => (
                  <article
                    key={discussion.id}
                    className="rounded-[2rem] border border-white/10 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-cyan-500/10 dark:bg-slate-900/90"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-700 dark:text-cyan-300">
                            <Tag className="h-3.5 w-3.5" />
                            {discussion.category}
                          </span>
                          <span>{discussion.author.name}</span>
                          <span>•</span>
                          <span>{formatDate(discussion.createdAt)}</span>
                        </div>

                        <h3 className="text-2xl font-bold leading-tight">{discussion.title}</h3>
                        <p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {discussion.body}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {discussion.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                        <button
                          type="button"
                          onClick={() => void handleLike(discussion.id)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${discussion.likedByCurrentUser ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                        >
                          <Heart className={`h-4 w-4 ${discussion.likedByCurrentUser ? "fill-current" : ""}`} />
                          {discussion.likesCount}
                        </button>

                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.commentsCount}
                        </div>

                        {discussion.canEdit ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => populateForEdit(discussion)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-slate-700 dark:text-slate-300"
                            >
                              <PencilLine className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(discussion.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white dark:border-rose-400/40 dark:text-rose-300"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <MessagesSquare className="h-4 w-4" />
                        Comments
                      </div>

                      <div className="mt-4 space-y-3">
                        {discussion.comments.length === 0 ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet. Start the conversation.</p>
                        ) : (
                          discussion.comments.slice(0, 3).map((comment) => (
                            <div key={comment.id} className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-slate-900">
                              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                <span>{comment.author.name}</span>
                                <span>•</span>
                                <span>{formatDate(comment.createdAt)}</span>
                              </div>
                              <p className="mt-2 leading-6 text-slate-700 dark:text-slate-200">{comment.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <input
                          minLength={2}
                          maxLength={1000}
                          value={commentDrafts[discussion.id] || ""}
                          onChange={(event) =>
                            setCommentDrafts((current) => ({
                              ...current,
                              [discussion.id]: event.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => void handleComment(discussion.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:bg-slate-900/90">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                <Sparkles className="h-4 w-4 text-cyan-500" />
                Trending
              </div>
              <div className="mt-4 space-y-4">
                {trendingDiscussions.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Trending discussions will show up here.</p>
                ) : (
                  trendingDiscussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                    >
                      <p className="text-sm font-bold leading-6">{discussion.title}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{discussion.category}</span>
                        <span>{discussion.likesCount} likes</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:bg-slate-900/90">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                <MessageSquare className="h-4 w-4 text-cyan-500" />
                Quick stats
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total posts</p>
                  <p className="mt-2 text-2xl font-bold">{discussions.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total comments</p>
                  <p className="mt-2 text-2xl font-bold">
                    {discussions.reduce((count, discussion) => count + discussion.comments.length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}