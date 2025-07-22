import { useState } from 'react';
import { Octokit } from '@octokit/core';
import toast from 'react-hot-toast';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const getOctokit = () => {

    if (!username || !token) return;
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
  };
};