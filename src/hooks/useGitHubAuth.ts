import { useState, useMemo } from 'react';
import { Octokit } from '@octokit/rest';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  // FIX: The Octokit instance only depends on the token for authentication.
  const octokit = useMemo(() => {
    // Only create an instance if a token exists.
    if (!token) return null;
    
    return new Octokit({ auth: token });
  }, [token]); // Dependency array should only contain `token`.

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