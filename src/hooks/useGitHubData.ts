import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

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
    if (!octokit || !username) {
      toast.error("PAT not found"); return
    }
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

      if (issuesResponse?.length || prsResponse?.length) toast.success(
        `Fetched ${issuesResponse.length} issues and ${prsResponse.length} PRs successfully.`
      );

      else toast("⚠️ No issues or PRs found", { icon: "🕵️‍♂️" });



    } catch (err: any) {
      if (err.status === 401 || err.status === 403) {
        toast.error("Please provide a valid GitHub token ");
      }
      else if (err.status === 422) toast.error("User not found")
      else {
        toast.error("something went wrong while fetching data")
      }
      // setError("Failed to fetched github date")
    } finally {
      setLoading(false);
    }
  }, [octokit]);

  return {
    issues,
    prs,
    loading,
    // error,
    fetchData,
  };
};