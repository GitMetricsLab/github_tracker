import { useState, useMemo, useEffect } from 'react';
import { Octokit } from 'octokit';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState(() => sessionStorage.getItem('tracker_username') || '');
  const [token, setToken] = useState(() => sessionStorage.getItem('tracker_token') || '');
  const [error, setError] = useState('');

  useEffect(() => {
    sessionStorage.setItem('tracker_username', username);
    sessionStorage.setItem('tracker_token', token);
  }, [username, token]);

  const octokit = useMemo(() => {
    if (!username) return null;
    if(token){
    return new Octokit({ auth: token });
    }
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
