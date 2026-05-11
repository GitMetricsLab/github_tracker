import { useState, useMemo } from 'react';
import { Octokit } from '@octokit/core';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const octokit = useMemo(() => {
    if (!token) return null;
    return new Octokit({ auth: token });
  }, [token]);

  const getOctokit = () => octokit;

  return {
    username,
    setUsername,
    token,
    setToken,
    error,
    setError,
    getOctokit,
  };
};
