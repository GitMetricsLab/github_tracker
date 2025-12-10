import React, { useEffect, useMemo, useState } from "react";
import api from "../../../lib/api";

interface UserProfile {
  username?: string;
  email?: string;
  password?: string;
  newPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditProfile() {
  const [form, setForm] = useState<UserProfile>({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored === "dark";
    setIsDark(dark);
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile");
        const user: UserProfile = res.data.user;
        setForm({
          username: user?.username || "",
          email: user?.email || "",
          password: "",
          newPassword: "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const isValid = useMemo(() => {
    if (!form.username || form.username.trim().length < 3) return false;
    if (form.email && !EMAIL_RE.test(form.email)) return false;
    if (!form.password || form.password.trim().length < 1) return false;
    if (changePassword && form.newPassword && form.newPassword.length < 6)
      return false;
    return true;
  }, [form, changePassword]);

  const onChange =
    (key: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: UserProfile = {
        username: form.username?.trim(),
        email: form.email?.trim(),
        password: form.password?.trim(),
      };

      if (changePassword && form.newPassword) {
        payload.newPassword = form.newPassword.trim();
      }

      const { data } = await api.put("/profile", payload);
      const updated: UserProfile = data?.user || payload;
      setForm((f) => ({ ...f, ...updated, password: "", newPassword: "" }));
      setSuccess(data?.message || "Profile updated successfully");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Error updating profile";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white text-black dark:bg-zinc-900 dark:text-zinc-100">
        <span className="animate-pulse text-sm opacity-70">
          Loading profile…
        </span>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border px-3 py-2 outline-none focus:ring border-zinc-300 bg-white text-black dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700";

  return (
    <div className="mx-auto max-w-xl p-4 sm:p-6 bg-white text-black dark:bg-zinc-900 dark:text-zinc-100 rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username *
          </label>
          <input
            id="username"
            type="text"
            value={form.username || ""}
            onChange={onChange("username")}
            className={inputCls}
            placeholder="your_username"
            required
            minLength={3}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email || ""}
            onChange={onChange("email")}
            className={inputCls}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Current Password *
          </label>
          <input
            id="password"
            type="password"
            value={form.password || ""}
            onChange={onChange("password")}
            className={inputCls}
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="changePassword"
            type="checkbox"
            checked={changePassword}
            onChange={(e) => setChangePassword(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-400 dark:border-zinc-600"
          />
          <label htmlFor="changePassword" className="text-sm font-medium">
            Change Password
          </label>
        </div>

        {changePassword && (
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={form.newPassword || ""}
              onChange={onChange("newPassword")}
              className={inputCls}
              placeholder="Enter new password"
            />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="border border-red-300 bg-red-50 px-3 py-2 text-sm rounded-md dark:bg-red-900/20 dark:border-red-900/40"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            role="status"
            className="border border-green-300 bg-green-50 px-3 py-2 text-sm rounded-md dark:bg-green-900/20 dark:border-green-900/40"
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="px-4 py-2 font-medium text-white rounded-md disabled:opacity-50"
          style={{ background: isDark ? "#18181b" : "black" }}
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
