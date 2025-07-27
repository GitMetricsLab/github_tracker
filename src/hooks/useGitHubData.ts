import { useState, useCallback } from 'react';

interface GitHubIssue {
  id: number;
  title: string;
  state: string;
  created_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export const useGitHubData = (octokit: any) => {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [prs, setPrs] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async (url: string, params: any): Promise<GitHubIssue[]> => {
    let page = 1;
    let results: GitHubIssue[] = [];
    let hasMore = true;

    while (hasMore) {
      const response = await octokit.request(url, { ...params, page });
      results = results.concat(response.data.items);
      hasMore = response.data.items.length === 100;
      page++;
    }

    return results;
  };

  const fetchData = useCallback(async (username: string) => {
    if (!octokit || !username) return;

    setLoading(true);
    setError('');

    try {
      const [issuesResponse, prsResponse] = await Promise.all([
        fetchAll('GET /search/issues', {
          q: `author:${username} is:issue`,
          sort: 'created',
          order: 'desc',
          per_page: 100,
        }),
        fetchAll('GET /search/issues', {
          q: `author:${username} is:pr`,
          sort: 'created',
          order: 'desc',
          per_page: 100,
        }),
      ]);

      setIssues(issuesResponse);
      setPrs(prsResponse);
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [octokit]);

  return {
    issues,
    prs,
    loading,
    error,
    fetchData,
  };
};