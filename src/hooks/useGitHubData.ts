import { useState, useCallback } from 'react';
import { classifyCommit } from '../utils/commitClassifier';

export const useGitHubData = (getOctokit: () => any) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchPaginated = async (octokit: any, username: string, type: string, page = 1, per_page = 10) => {
    const q = `author:${username} is:${type}`;
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

  const fetchCommitsPaginated = async (octokit: any, username: string, page = 1, per_page = 10) => {
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

  const fetchData = useCallback(
    async (username: string, page = 1, perPage = 10) => {
        
      const octokit = getOctokit();

      if (!octokit || !username) return;

      setLoading(true);
      setError('');

      try {
        const [issueRes, prRes, commitRes] = await Promise.all([
          fetchPaginated(octokit, username, 'issue', page, perPage),
          fetchPaginated(octokit, username, 'pr', page, perPage),
          fetchCommitsPaginated(octokit, username, page, perPage).catch((err) => {
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
        const errorMessage = err.message?.toLowerCase() || "";
        if (err.status === 403) {
          setError('GitHub API rate limit exceeded. Please provide a PAT to continue.');
          setRateLimited(true); 
        } else if (errorMessage.includes("do not exist")){
          setError('User not found. Please check the spelling of the GitHub username.');
        } else if (err.status === 401 || errorMessage.includes("permission")){
          setError('Private repository detected. Please input PAT.');
        }else if(err.status===404){
          setError('Resource not found.');
        }
        else if (errorMessage.includes("validation failed")) {
          setError('Invalid GitHub username or insufficient permissions.');
        }
        else {
          setError(
            'Unable to fetch GitHub data. Please verify the username, token, or network connection.'
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [getOctokit]
  );

  return {
    issues,
    prs,
    commits,
    totalIssues,
    totalPrs,
    totalCommits,
    loading,
    error,
    fetchData,
  };
};
