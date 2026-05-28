import { useState, useCallback } from "react";

interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  location?: string;
  company?: string;
  blog?: string;
  created_at: string;
}

export const useGitHubProfile = (
  getOctokit: () => any
) => {
  const [profile, setProfile] =
    useState<GitHubProfile | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fetchProfile = useCallback(async () => {
    const octokit = getOctokit();

    if (!octokit) return;

    setLoading(true);
    setError("");

    try {
      const response =
        await octokit.request("GET /user");

      setProfile(response.data);

    } catch (err: any) {

      setError(
        err.message ||
        "Failed to fetch profile"
      );

    } finally {
      setLoading(false);
    }
  }, [getOctokit]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
  };
};