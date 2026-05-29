import { useCallback, useEffect, useRef, useState } from 'react';
import { Octokit } from '@octokit/core';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const octokitRef = useRef(new Octokit());

  useEffect(() => {
    if(token){
      octokitRef.current = new Octokit({ auth: token });
      return;
    }
    octokitRef.current = new Octokit();
  }, [token]);

  const getOctokit = useCallback(() => octokitRef.current, []);

  return {
    username,
    setUsername,
    token,
    setToken,
    getOctokit,
  };
};
