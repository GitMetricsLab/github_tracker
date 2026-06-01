import { useState, useMemo } from 'react';
import { Octokit } from '@octokit/core';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  const octokit = useMemo(() => {
    if (!username) return null;
    if (token) {
      return new Octokit({ auth: token });
    }
    console.warn(
      'No GitHub token provided. API calls will be limited to 60 requests per hour.'
    );
    return new Octokit();
  }, [username, token]);

  const getOctokit = () => octokit;

  return {
    username,
    setUsername,
    token,
    setToken,
    getOctokit,
  };
};
