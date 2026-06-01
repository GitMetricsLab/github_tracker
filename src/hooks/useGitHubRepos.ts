import { useState, useCallback } from 'react';
import { Octokit } from '@octokit/core';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  visibility: string;
  fork: boolean;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  topics: string[];
  license: { name: string } | null;
  default_branch: string;
  size: number;
}

export const useGitHubRepos = (getOctokit: () => Octokit | null) => {
  const [repos, setRepos]           = useState<GitHubRepo[]>([]);
  const [totalRepos, setTotalRepos] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const fetchRepos = useCallback(
    async (username: string, page = 1, perPage = 12) => {
      const octokit = getOctokit();
      if (!octokit || !username.trim()) return;

      setLoading(true);
      setError('');

      try {
        const response = await octokit.request('GET /users/{username}/repos', {
          username,
          per_page: perPage,
          page,
          sort: 'pushed',
          direction: 'desc',
          type: 'owner',
        });

        const linkHeader = (response.headers as any)?.link ?? '';
        const lastMatch  = linkHeader.match(/page=(\d+)>; rel="last"/);
        const total      = lastMatch
          ? parseInt(lastMatch[1], 10) * perPage
          : (page - 1) * perPage + response.data.length;

        setRepos(response.data as GitHubRepo[]);
        setTotalRepos(total);
      } catch (err: any) {
        const status  = err?.status;
        const message = err?.message?.toLowerCase() ?? '';

        if (status === 403) {
          setError('GitHub API rate limit exceeded. Please provide a PAT to continue.');
        } else if (status === 404 || message.includes('not found')) {
          setError('User not found. Please check the GitHub username.');
        } else if (status === 401) {
          setError('Invalid token. Please check your Personal Access Token.');
        } else {
          setError('Unable to fetch repositories. Please verify the username or network connection.');
        }
      } finally {
        setLoading(false);
      }
    },
    [getOctokit]
  );

  return { repos, totalRepos, loading, error, fetchRepos };
};