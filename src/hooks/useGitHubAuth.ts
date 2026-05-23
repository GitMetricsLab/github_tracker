import { useState, useMemo } from 'react';
import { Octokit } from '@octokit/core';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (username) {
      sessionStorage.setItem('tracker_username', username);
    } else {
      sessionStorage.removeItem('tracker_username');
    }
    if (token) {
      sessionStorage.setItem('tracker_token', token);
    } else {
      sessionStorage.removeItem('tracker_token');
    }
  }, [username, token]);

  const getOctokit = () => octokit;

  const logout = () => {
    setUsername('');
    setToken('');
    setError('');
    sessionStorage.removeItem('tracker_username');
    sessionStorage.removeItem('tracker_token');
  };

  return {
    username,
    setUsername,
    token,
    setToken,
    getOctokit,
    logout,
  };
};
