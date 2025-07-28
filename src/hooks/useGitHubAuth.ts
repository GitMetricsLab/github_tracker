import { useState } from 'react';
import { Octokit } from '@octokit/core';

export const useGitHubAuth = () => {
  const [username, setUsernameState] = useState(() => localStorage.getItem('username') || '');
  const [token, setTokenState] = useState(() => localStorage.getItem('token') || '');
  const [error, setError] = useState('');

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem('username', name);
  };
  const setToken = (tok: string) => {
    setTokenState(tok);
    localStorage.setItem('token', tok);
  };
  const logout = () => {
    setUsernameState('');
    setTokenState('');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  const getOctokit = () => {
    if (!username || !token) return null;
    return new Octokit({ auth: token });
  };

  return {
    username,
    setUsername,
    token,
    setToken,
    error,
    setError,
    getOctokit,
    logout,
  };
};