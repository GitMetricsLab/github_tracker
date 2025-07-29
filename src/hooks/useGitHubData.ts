import { useState, useCallback } from 'react';

export const useGitHubData = (octokit) => {
  const [issues, setIssues] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async (url, params) => {
    let page = 1;
    let results = [];
    let hasMore = true;

    while (hasMore) {
      const response = await octokit.request(url, { ...params, page });
      results = results.concat(response.data.items);
      hasMore = response.data.items.length === 100;
      page++;
    }

    return results;
  };

  const fetchData = useCallback(async (username) => {
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
    } catch (err) {
      setError(err.message);
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
