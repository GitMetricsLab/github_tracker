import { useState, useEffect } from 'react';
import { Octokit } from 'octokit';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState(() => sessionStorage.getItem('tracker_username') || '');
  const [token, setToken] = useState(() => sessionStorage.getItem('tracker_token') || '');
  const [error, setError] = useState('');

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

  const getOctokit = () => {
    try {
      setError('');
      if (!username) return null;
      if (token) {
        return new Octokit({ auth: token });
      }
      return new Octokit();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    }
  };

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
    error,
    setError,
    getOctokit,
    logout,
  };
};
