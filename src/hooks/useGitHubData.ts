import { useState, useCallback } from 'react';

export const useGitHubData = (getOctokit: () => any) => {
  const [issues, setIssues] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchPaginated = async (
    octokit: any, 
    username: string, 
    type: string, 
    page = 1, 
    per_page = 10,
    filters: any = {}
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
    async (username: string, page = 1, perPage = 10, type?: 'issue' | 'pr', filters: any = {}) => {
      const octokit = getOctokit();
      if (!octokit || !username || rateLimited) return;

      setLoading(true);
      setError('');

      try {
        if (type) {
          // Fetch only the requested type
          const res = await fetchPaginated(octokit, username, type, page, perPage, filters);
          if (type === 'issue') {
            setIssues(res.items);
            setTotalIssues(res.total);
          } else {
            setPrs(res.items);
            setTotalPrs(res.total);
          }
        } else {
          // Fetch both (used for initial load or if type not specified)
          const [issueRes, prRes] = await Promise.all([
            fetchPaginated(octokit, username, 'issue', page, perPage, filters),
            fetchPaginated(octokit, username, 'pr', page, perPage, filters),
          ]);
          setIssues(issueRes.items);
          setTotalIssues(issueRes.total);
          setPrs(prRes.items);
          setTotalPrs(prRes.total);
        }
      } catch (err: any) {
        if (err.status === 403) {
          setError('GitHub API rate limit exceeded. Please wait or use a token.');
          setRateLimited(true);
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
    totalIssues,
    totalPrs,
    loading,
    error,
    fetchData,
  };
};
