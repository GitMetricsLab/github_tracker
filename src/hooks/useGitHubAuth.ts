import { useState, useMemo, useEffect } from 'react';
import { Octokit } from '@octokit/core';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState(() => localStorage.getItem('tracker_username') || '');
  const [token, setToken] = useState(() => localStorage.getItem('tracker_token') || '');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('tracker_username', username);
    localStorage.setItem('tracker_token', token);
  }, [username, token]);

  const octokit = useMemo(() => {
    if (!username || !token) return null;
    return new Octokit({ auth: token });
  }, [username, token]);

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
