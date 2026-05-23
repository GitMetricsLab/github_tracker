import { useState, useCallback, useRef, useEffect } from 'react';
import { classifyCommit } from '../utils/commitClassifier';

export const useGitHubData = (getOctokit: () => any) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
import { useState, useCallback, useRef } from 'react';
import { Octokit } from '@octokit/core';

interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: {
    merged_at: string | null;
  };
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

export const useGitHubData = (
  getOctokit: () => Octokit | null
) => {
  const [issues, setIssues] = useState<GitHubItem[]>([]);
  const [prs, setPrs] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchPaginated = async (octokit: any, username: string, type: string, page = 1, per_page = 10, signal?: AbortSignal) => {
    const q = `author:${username} is:${type}`;
    const response = await octokit.request('GET /search/issues', {
      q,
      sort: 'created',
      order: 'desc',
      per_page,
      page,
      request: signal ? { signal } : undefined,
    });
  // Prevent stale responses overwriting latest data
  const lastRequestId = useRef(0);

  const fetchPaginated = async (
    octokit: Octokit,
    username: string,
    type: 'issue' | 'pr',
    page = 1,
    perPage = 10,
    filters: FetchFilters = {}
  ) => {
    let q = `author:${username} is:${type}`;

    if (filters.search) {
      q += ` ${filters.search} in:title`;
    }

    if (filters.repo) {
      q += ` repo:${filters.repo}`;
    }

    if (filters.startDate) {
      q += ` created:>=${filters.startDate}`;
    }

    if (filters.endDate) {
      q += ` created:<=${filters.endDate}`;
    }

    if (filters.state === 'open' || filters.state === 'closed') {
      q += ` is:${filters.state}`;
    }

    if (filters.state === 'merged' && type === 'pr') {
      q += ` is:merged`;
    }

    const response = await octokit.request(
      'GET /search/issues',
      {
        q,
        sort: 'created',
        order: 'desc',
        per_page: perPage,
        page,
      }
    );

    return {
      items: response.data.items as GitHubItem[],
      total: response.data.total_count,
    };
  };

  const fetchCommitsPaginated = async (octokit: any, username: string, page = 1, per_page = 10, signal?: AbortSignal) => {
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
      request: signal ? { signal } : undefined,
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

  // refs for debounce timer and abort controller
  const debounceRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    (username: string, page = 1, perPage = 10) => {
      const DEBOUNCE_MS = 350;

      const octokit = getOctokit();

      if (!octokit) return;

      // debounce: clear existing timer
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(async () => {
        // cancel previous in-flight requests
        if (abortControllerRef.current) {
          try {
            abortControllerRef.current.abort();
          } catch (e) {
            // ignore
          }
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError('');

        try {
          const [issueRes, prRes, commitRes] = await Promise.all([
            fetchPaginated(octokit, username, 'issue', page, perPage, controller.signal),
            fetchPaginated(octokit, username, 'pr', page, perPage, controller.signal),
            fetchCommitsPaginated(octokit, username, page, perPage, controller.signal).catch((err) => {
              if (err.name === 'AbortError') return { items: [], total: 0 };
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
          setRateLimited(false);
        } catch (err: any) {
          if (err.name === 'AbortError') {
            return;
          }
          const errorMessage = err.message?.toLowerCase() || "";
          if (err.status === 403) {
            setError('GitHub API rate limit exceeded. Please provide a PAT to continue.');
            setRateLimited(true);
          } else if (errorMessage.includes("do not exist")){
            setError('User not found. Please check the spelling of the GitHub username.');
          } else if (err.status === 401 || errorMessage.includes("permission")){
            setError('Private repository detected. Please input PAT.');
          } else if(err.status===404){
            setError('Resource not found.');
          } else if (errorMessage.includes("validation failed")) {
            setError('Invalid GitHub username or insufficient permissions.');
          } else {
            setError(
              'Unable to fetch GitHub data. Please verify the username, token, or network connection.'
            );
          }
        } finally {
          setLoading(false);
          if (abortControllerRef.current === controller) abortControllerRef.current = null;
        }
      }, DEBOUNCE_MS);
    async (
      username: string,
      page = 1,
      perPage = 10,
      activeTab: 'issue' | 'pr' | 'both' = 'both',
      filters: FetchFilters = {}
    ) => {
      const octokit = getOctokit();

      if (!octokit || !username.trim() || rateLimited) {
        return;
      }

      const requestId = ++lastRequestId.current;

      setLoading(true);
      setError('');

      try {
        const shouldFetchIssues =
          activeTab === 'issue' || activeTab === 'both';

        const shouldFetchPrs =
          activeTab === 'pr' || activeTab === 'both';

        const requests: Promise<any>[] = [];

        if (shouldFetchIssues) {
          requests.push(
            fetchPaginated(
              octokit,
              username,
              'issue',
              page,
              perPage,
              filters
            )
          );
        }

        if (shouldFetchPrs) {
          requests.push(
            fetchPaginated(
              octokit,
              username,
              'pr',
              page,
              perPage,
              filters
            )
          );
        }

        const results = await Promise.allSettled(requests);

        // Ignore stale requests
        if (requestId !== lastRequestId.current) {
          return;
        }

        let resultIndex = 0;

        if (shouldFetchIssues) {
          const issueResult = results[resultIndex];

          if (issueResult.status === 'fulfilled') {
            setIssues(issueResult.value.items);
            setTotalIssues(issueResult.value.total);
          } else {
            setIssues([]);
            setTotalIssues(0);
          }

          resultIndex++;
        }

        if (shouldFetchPrs) {
          const prResult = results[resultIndex];

          if (prResult.status === 'fulfilled') {
            setPrs(prResult.value.items);
            setTotalPrs(prResult.value.total);
          } else {
            setPrs([]);
            setTotalPrs(0);
          }
        }

        const hasRejected = results.some(
          (result) => result.status === 'rejected'
        );

        if (hasRejected) {
          setError(
            'Some GitHub data could not be fetched completely.'
          );
        }

        setRateLimited(false);
      } catch (err: unknown) {
        if (requestId !== lastRequestId.current) {
          return;
        }

        const error = err as {
          status?: number;
          message?: string;
        };

        const errorMessage =
          error.message?.toLowerCase() || '';

        if (error.status === 403) {
          setError(
            'GitHub API rate limit exceeded. Please provide a PAT to continue.'
          );
          setRateLimited(true);
        } else if (
          errorMessage.includes('do not exist')
        ) {
          setError(
            'User not found. Please check the GitHub username.'
          );
        } else if (
          errorMessage.includes('validation failed')
        ) {
          setError(
            'Invalid GitHub username or insufficient permissions.'
          );
        } else if (
          error.status === 401 ||
          errorMessage.includes('permission')
        ) {
          setError(
            'Private repository detected. Please provide a PAT.'
          );
        } else if (error.status === 404) {
          setError('Resource not found.');
        } else {
          setError(
            'Unable to fetch GitHub data. Please verify the username, token, or network connection.'
          );
        }
      } finally {
        if (requestId === lastRequestId.current) {
          setLoading(false);
        }
      }
    },
    [getOctokit, rateLimited]
  );

  // cleanup on unmount: clear debounce timer and abort any in-flight requests
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          // ignore
        }
        abortControllerRef.current = null;
      }
    };
  }, []);

  return {
    issues,
    prs,
    commits,
    totalIssues,
    totalPrs,
    totalCommits,
    loading,
    error,
    rateLimited,
    fetchData,
  };
};
