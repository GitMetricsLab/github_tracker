import { useState, useCallback } from 'react';

export const useGitHubData = (getOctokit: () => any) => {
  const [issues, setIssues] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchPaginated = async (octokit: any, username: string, type: string, page = 1, per_page = 10) => {
    const query = `
      query ($queryString: String!, $first: Int!, $after: String) {
        search(query: $queryString, type: ISSUE, first: $first, after: $after) {
          issueCount
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              ... on Issue {
                databaseId
                title
                url
                createdAt
                state
                repository { url }
              }
              ... on PullRequest {
                databaseId
                title
                url
                createdAt
                state
                mergedAt
                repository { url }
              }
            }
          }
        }
      }
    `;

    const queryString = `author:${username} is:${type}`;
    const response = await octokit.graphql(query, {
      queryString,
      first: per_page,
      after: page > 1 ? btoa(`cursor:${(page - 1) * per_page}`) : null,
    });

    return {
      items: response.search.edges.map((edge: any) => edge.node),
      total: response.search.issueCount,
    };
  };

  const fetchData = useCallback(
    async (username: string, page = 1, perPage = 10) => {
        
      const octokit = getOctokit();

      if (!octokit || !username || rateLimited) return;

      setLoading(true);
      setError('');

      try {
        const [issueRes, prRes] = await Promise.all([
          fetchPaginated(octokit, username, 'issue', page, perPage),
          fetchPaginated(octokit, username, 'pr', page, perPage),
        ]);

        setIssues(issueRes.items);
        setPrs(prRes.items);
        setTotalIssues(issueRes.total);
        setTotalPrs(prRes.total);
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
    totalIssues,
    totalPrs,
    loading,
    error,
    fetchData,
  };
};
