import { useState, useCallback } from 'react';

export interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
}

interface GitHubSearchResponse {
  data: {
    items: GitHubItem[];
    total_count: number;
  };
}

interface GitHubClient {
  request: (
    route: 'GET /search/issues',
    options: Record<string, string | number>
  ) => Promise<GitHubSearchResponse>;
}

interface GitHubApiError {
  status?: number;
  message?: string;
}

export const useGitHubData = (getOctokit: () => GitHubClient | null) => {
  const [issues, setIssues] = useState<GitHubItem[]>([]);
  const [prs, setPrs] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchPaginated = async (octokit: GitHubClient, username: string, type: string, page = 1, per_page = 10) => {
    const q = `author:${username} is:${type}`;
    const response = await octokit.request('GET /search/issues', {
      q,
      sort: 'created',
      order: 'desc',
      per_page,
      page,
    });

    return {
      items: response.data.items,
      total: response.data.total_count,
    };
  };

  const fetchData = useCallback(
    async (username: string, page = 1, perPage = 10) => {
        
      const octokit = getOctokit();

      if (!octokit || !username || rateLimited) return;

      setLoading(true);
      setError('');

      try {
        const [issueRes, prRes] = await Promise.all([
          fetchPaginated(octokit, username, 'issue', page, perPage),
          fetchPaginated(octokit, username, 'pr', page, perPage),
        ]);

        setIssues(issueRes.items);
        setPrs(prRes.items);
        setTotalIssues(issueRes.total);
        setTotalPrs(prRes.total);
      } catch (err: unknown) {
        const githubError = err as GitHubApiError;

        if (githubError.status === 403) {
          setError('GitHub API rate limit exceeded. Please wait or use a token.');
          setRateLimited(true); // Prevent further fetches
        } else {
          setError(githubError.message || 'Failed to fetch data');
        }
      } finally {
        setLoading(false);
      }
    },
    [getOctokit, rateLimited]
  );

  return {
    issues,
    prs,
    totalIssues,
    totalPrs,
    loading,
    error,
    fetchData,
  };
};
