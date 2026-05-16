import { useState, useCallback } from 'react';
import { classifyCommit } from '../utils/commitClassifier';

export const useGitHubData = (getOctokit: () => any) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchPaginated = async (octokit: any, username: string, type: string, page = 1, per_page = 10) => {
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

  const fetchCommitsPaginated = async (octokit: any, username: string, page = 1, per_page = 10) => {
    const q = `author:${username}`;
    const response = await octokit.request('GET /search/commits', {
      q,
      sort: 'author-date',
      order: 'desc',
      per_page,
      page,
      headers: {
        accept: 'application/vnd.github.cloak-preview+json',
      },
    });

    const items = response.data.items.map((item: any) => ({
      ...item,
      created_at: item.commit.author?.date || item.commit.committer?.date,
      classifiedInfo: classifyCommit(item.commit.message),
    }));

    return {
      items,
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
        const [issueRes, prRes, commitRes] = await Promise.all([
          fetchPaginated(octokit, username, 'issue', page, perPage),
          fetchPaginated(octokit, username, 'pr', page, perPage),
          fetchCommitsPaginated(octokit, username, page, perPage).catch((err) => {
            console.error('Commit fetch failed:', err);
            return { items: [], total: 0 };
          }),
        ]);

        setIssues(issueRes.items);
        setPrs(prRes.items);
        setCommits(commitRes.items);
        setTotalIssues(issueRes.total);
        setTotalPrs(prRes.total);
        setTotalCommits(commitRes.total);
      } catch (err: any) {
        if (err.status === 403) {
          setError('GitHub API rate limit exceeded. Please wait or use a token.');
          setRateLimited(true); // Prevent further fetches
        } else {
          setError(err.message || 'Failed to fetch data');
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
    commits,
    totalIssues,
    totalPrs,
    totalCommits,
    loading,
    error,
    fetchData,
  };
};
