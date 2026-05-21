import { useState, useCallback, useRef, useEffect } from 'react';

export const useGitHubData = (getOctokit: () => any) => {
  const [issues, setIssues] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  // Store AbortController to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to cancel any pending requests
  const cancelPendingRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cancelPendingRequest();
    };
  }, [cancelPendingRequest]);

  const fetchPaginated = async (
    octokit: any,
    username: string,
    type: string,
    page = 1,
    per_page = 10,
    signal?: AbortSignal
  ) => {
    const q = `author:${username} is:${type}`;
    const response = await octokit.request('GET /search/issues', {
      q,
      sort: 'created',
      order: 'desc',
      per_page,
      page,
      request: {
        signal, // Pass AbortSignal to the request
      },
    });

    return {
      items: response.data.items,
      total: response.data.total_count,
    };
  };

  const fetchData = useCallback(
    async (username: string, page = 1, perPage = 10) => {
      // Validate inputs
      if (!username || username.trim().length === 0) {
        setError('Please enter a GitHub username.');
        return;
      }

      const octokit = getOctokit();

      if (!octokit) {
        setError('Authentication not initialized.');
        return;
      }

      // Cancel any existing in-flight requests
      cancelPendingRequest();

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setError('');

      try {
        const [issueRes, prRes] = await Promise.all([
          fetchPaginated(octokit, username, 'issue', page, perPage, signal),
          fetchPaginated(octokit, username, 'pr', page, perPage, signal),
        ]);

        // Check if request was aborted before updating state
        if (!signal.aborted) {
          setIssues(issueRes.items);
          setPrs(prRes.items);
          setTotalIssues(issueRes.total);
          setTotalPrs(prRes.total);
          setRateLimited(false);
        }
      } catch (err: any) {
        // Don't show error if request was intentionally aborted
        if (err.name === 'AbortError') {
          return;
        }

        const errorMessage = err.message?.toLowerCase() || "";
        if (err.status === 403) {
          setError('GitHub API rate limit exceeded. Please provide a PAT to continue.');
          setRateLimited(true);
        } else if (errorMessage.includes("do not exist")) {
          setError('User not found. Please check the spelling of the GitHub username.');
        } else if (err.status === 401 || errorMessage.includes("permission")) {
          setError('Private repository detected. Please input PAT.');
        } else if (err.status === 404) {
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
      }
    },
    [getOctokit, cancelPendingRequest]
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
