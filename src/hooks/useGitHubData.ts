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

      if (!octokit || !username) return;

      const requestId = ++lastRequestId.current;
      setLoading(true);
      setError('');
      setIssues([]);
      setPrs([]);
      setTotalIssues(0);
      setTotalPrs(0);

      try {
        const [issueRes, prRes] = await Promise.allSettled([
          fetchPaginated(octokit, username, 'issue', page, perPage),
          fetchPaginated(octokit, username, 'pr', page, perPage),
        ]);

        if (issueRes.status === 'fulfilled') {
          setIssues(issueRes.value.items);
          setTotalIssues(issueRes.value.total);
        }

        if (prRes.status === 'fulfilled') {
          setPrs(prRes.value.items);
          setTotalPrs(prRes.value.total);
        }

        if (
          issueRes.status === 'rejected' &&
          prRes.status === 'rejected'
        ) {
          const error =
            issueRes.reason ??
            prRes.reason ??
            new Error('Failed to fetch GitHub data');

          throw error;
        }

        if (
          issueRes.status === 'rejected' ||
          prRes.status === 'rejected'
        ) {
          setError('Some GitHub data could not be fetched completely.');
        }

        setRateLimited(false);
      } catch (err: any) {
        const errorMessage = err.message?.toLowerCase() || "";
        if (err.status === 403) {
          setError('GitHub API rate limit exceeded. Please provide a PAT to continue.');
          setRateLimited(true); 
        } else if (errorMessage.includes("do not exist")){
          setError('User not found. Please check the spelling of the GitHub username.');
        } 
        else if (errorMessage.includes("validation failed")) {
          setError('Invalid GitHub username or insufficient permissions.');
        }
        else if (err.status === 401 || errorMessage.includes("permission")){
          setError('Private repository detected. Please input PAT.');
        }else if(err.status===404){
          setError('Resource not found.');
        }
        
        else {
          setError(
            'Unable to fetch GitHub data. Please verify the username, token, or network connection.'
          );
        }
        }
      } finally {
        if (requestId === lastRequestId.current) {
          setLoading(false);
        }
      }
    },
    [getOctokit]
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
