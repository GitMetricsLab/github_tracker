import { useState, useCallback, useRef } from 'react';
import { Octokit } from '@octokit/core';

interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
}

interface FetchFilters {
  search?: string;
  repo?: string;
  startDate?: string;
  endDate?: string;
  state?: string;
}

export const useGitHubData = (getOctokit: () => Octokit | null) => {
  const [issues, setIssues] = useState<GitHubItem[]>([]);
  const [prs, setPrs] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  
  // Track the latest request ID to prevent stale overwrites
  const lastRequestId = useRef(0);

  const fetchPaginated = async (
    octokit: Octokit, 
    username: string, 
    type: string, 
    page = 1, 
    per_page = 10,
    filters: FetchFilters = {}
  ) => {
    let q = `author:${username} is:${type}`;
    
    if (filters.search) q += ` ${filters.search} in:title`;
    if (filters.repo) q += ` repo:${filters.repo}`;
    if (filters.startDate) q += ` created:>=${filters.startDate}`;
    if (filters.endDate) q += ` created:<=${filters.endDate}`;
    
    if (filters.state === 'open' || filters.state === 'closed') {
      q += ` is:${filters.state}`;
    } else if (filters.state === 'merged') {
      q += ` is:merged`;
    }

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
    async (username: string, page = 1, perPage = 10, activeTab: 'issue' | 'pr' = 'issue', filters: FetchFilters = {}) => {
      const octokit = getOctokit();
      if (!octokit || !username || rateLimited) return;

      const requestId = ++lastRequestId.current;
      setLoading(true);
      setError('');

      try {
        // We fetch BOTH even if one tab is active to keep totals synchronized as requested
        const [issueRes, prRes] = await Promise.all([
          fetchPaginated(octokit, username, 'issue', activeTab === 'issue' ? page : 1, perPage, filters),
          fetchPaginated(octokit, username, 'pr', activeTab === 'pr' ? page : 1, perPage, filters),
        ]);

        // Only update state if this is still the latest request
        if (requestId === lastRequestId.current) {
          setIssues(issueRes.items);
          setTotalIssues(issueRes.total);
          setPrs(prRes.items);
          setTotalPrs(prRes.total);
        }
      } catch (err: unknown) {
        if (requestId === lastRequestId.current) {
          const error = err as { status?: number; message?: string };
          if (error.status === 403) {
            setError('GitHub API rate limit exceeded. Please wait or use a token.');
            setRateLimited(true);
          } else {
            setError(error.message || 'Failed to fetch data');
          }
        }
      } finally {
        if (requestId === lastRequestId.current) {
          setLoading(false);
        }
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
