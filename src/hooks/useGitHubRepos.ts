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
  const [repos,      setRepos]      = useState<GitHubRepo[]>([]);
  const [allRepos,   setAllRepos]   = useState<GitHubRepo[]>([]);
  const [totalRepos, setTotalRepos] = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const fetchRepos = useCallback(
    async (username: string, page = 1, perPage = 12, token?: string) => {
      const octokit = getOctokit();
      if (!octokit || !username.trim()) return;

      setLoading(true);
      setError('');

      try {
        let endpoint: 'GET /user/repos' | 'GET /users/{username}/repos';

        let params: Record<string, unknown> = {
          per_page:  perPage,
          page,
          sort:      'pushed',
          direction: 'desc',
        };

        if (token) {
          const authUser           = await octokit.request('GET /user');
          const authenticatedLogin = authUser.data.login.toLowerCase();
          const requestedLogin     = username.trim().toLowerCase();

          if (!requestedLogin || requestedLogin === authenticatedLogin) {
            // Token owner is viewing their own repos — use authenticated
            // endpoint so private repos are included
            endpoint = 'GET /user/repos';
            params   = { ...params, visibility: 'all', affiliation: 'owner' };
          } else {
            // Viewing someone else's repos — public endpoint only
            endpoint = 'GET /users/{username}/repos';
            params   = { ...params, username, type: 'owner' };
          }
        } else {
          endpoint = 'GET /users/{username}/repos';
          params   = { ...params, username, type: 'owner' };
        }

        const response = await octokit.request(endpoint, params);

        const linkHeader =
          typeof response.headers?.link === 'string'
            ? response.headers.link
            : '';

        const lastMatch = linkHeader.match(/page=(\d+)>; rel="last"/);

        const pageRepos = response.data as GitHubRepo[];
        setRepos(pageRepos);

        // FIX: only update totalRepos on page 1.
        // On page > 1 we keep the accurate value that was set during the
        // initial page-1 fetch (via all.length), preventing the partial-last-
        // page overestimate from corrupting the pagination UI.
        if (page === 1) {
          if (!lastMatch) {
            // Single page — exact count
            setTotalRepos(pageRepos.length);
            setAllRepos(pageRepos);
          } else {
            // Multiple pages — fetch last page for exact item count,
            // then fetch all repos for global search/filter
            const lastPage     = parseInt(lastMatch[1], 10);
            const lastParams   = { ...params, page: lastPage };
            const lastResponse = await octokit.request(endpoint, lastParams);
            const exactTotal   =
              (lastPage - 1) * perPage +
              (lastResponse.data as GitHubRepo[]).length;

            setTotalRepos(exactTotal);

            // Fetch all repos (per_page=100) for client-side search/filter
            const allParams   = { ...params, per_page: 100, page: 1 };
            const allResponse = await octokit.request(endpoint, allParams);
            let all           = [...(allResponse.data as GitHubRepo[])];

            const allLink =
              typeof allResponse.headers?.link === 'string'
                ? allResponse.headers.link
                : '';
            const allLast = allLink.match(/page=(\d+)>; rel="last"/);

            if (allLast) {
              const totalPages = parseInt(allLast[1], 10);
              const rest = await Promise.all(
                Array.from({ length: totalPages - 1 }, (_, i) =>
                  octokit.request(endpoint, { ...allParams, page: i + 2 })
                )
              );
              rest.forEach((r) => {
                all = all.concat(r.data as GitHubRepo[]);
              });
            }

            // Use all.length as the definitive total (exact, not estimated)
            setAllRepos(all);
            setTotalRepos(all.length);
          }
        }
        // page > 1: setRepos already called above, totalRepos intentionally
        // NOT updated — we keep the accurate value from the page-1 fetch.

      } catch (err: unknown) {
        const errorObj = err as { status?: number; message?: string };
        const status   = errorObj.status;
        const message  = errorObj.message?.toLowerCase() ?? '';

        let errorMsg: string;
        if (status === 403) {
          errorMsg = 'GitHub API rate limit exceeded. Please provide a PAT to continue.';
        } else if (status === 404 || message.includes('not found')) {
          errorMsg = 'User not found. Please check the GitHub username.';
        } else if (status === 401) {
          errorMsg = 'Invalid token. Please check your Personal Access Token.';
        } else {
          errorMsg = 'Unable to fetch repositories. Please verify the username or network connection.';
        }

        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [getOctokit]
  );

  return { repos, allRepos, totalRepos, loading, error, fetchRepos };
};