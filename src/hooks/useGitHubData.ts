import { useState, useCallback } from 'react';
import { Octokit } from '@octokit/rest';
import { Endpoints } from "@octokit/types"; 

// FIX: Derive the item type directly from the library instead of defining it manually.
type IssueSearchResponse = Endpoints["GET /search/issues"]["response"];
export type GitHubItem = IssueSearchResponse["data"]["items"][0];

export const useGitHubData = (getOctokit: () => Octokit | null) => {
  const [issues, setIssues] = useState<GitHubItem[]>([]);
  const [prs, setPrs] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchData = useCallback(
    async (
      username: string,
      page: number,
      perPage: number,
      type: 'issue' | 'pr',
      state: string
    ) => {
      const octokit = getOctokit();
      if (!octokit || !username || rateLimited) return;

      setLoading(true);
      setError('');
      setRateLimited(false);

      try {
        let query = `author:${username} is:${type}`;
        if (state !== 'all') {
          query += state === 'merged' ? ` is:merged` : ` state:${state}`;
        }

        const response = await octokit.request('GET /search/issues', {
          q: query,
          sort: 'created',
          order: 'desc',
          per_page: perPage,
          page,
        });

        if (type === 'issue') {
          setIssues(response.data.items);
          setTotalIssues(response.data.total_count);
        } else {
          setPrs(response.data.items);
          setTotalPrs(response.data.total_count);
        }
      } catch (err: any) {
        if (err.status === 403) {
          setError('GitHub API rate limit exceeded. Please wait or use a valid token.');
          setRateLimited(true);
        } else {
          setError(err.message || 'Failed to fetch data');
          if (type === 'issue') {
            setIssues([]);
            setTotalIssues(0);
          } else {
            setPrs([]);
            setTotalPrs(0);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [getOctokit, rateLimited]
  );

  return { issues, prs, totalIssues, totalPrs, loading, error, fetchData };
};