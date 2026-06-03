import { useState, useMemo, useEffect } from 'react';
import { Octokit } from '@octokit/core';

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const octokit = useMemo(() => {
    if (!username) return null;
    if(token){
      return new Octokit({ auth: token });
    }
    return new Octokit();
  }, [username, token]);

  // Clear error when username or token changes, before validation runs
  useEffect(() => {
    setError('');
  }, [username, token]);

  // Validate token format and authentication on mount or change
  useEffect(() => {
    if (!token || !username) {
      return;
    }

    const controller = new AbortController();

    const validateAuth = async () => {
      if (!octokit) return;
      
      try {
        // Attempt a simple API call to verify the token is valid
        await octokit.request('GET /user', { request: { signal: controller.signal } });
        // Only update state if request was not aborted
        if (!controller.signal.aborted) {
          setError('');
        }
      } catch (err: unknown) {
        // Ignore if request was aborted
        if (controller.signal.aborted) {
          return;
        }

        const error = err as {
          status?: number;
          message?: string;
        };

        if (error.status === 401) {
          setError('Invalid personal access token. Please check and try again.');
        } else if (error.status === 403) {
          setError('Token has insufficient permissions or has expired.');
        } else if (error.message?.includes('Bad credentials')) {
          setError('Bad credentials. Please verify your personal access token.');
        } else {
          setError(`Authentication error: ${error.message || 'Unknown error'}`);
        }
      }
    };

    // Validate on token change (but with a small delay to avoid excessive API calls during typing)
    const timeoutId = setTimeout(validateAuth, 500);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [token, username, octokit]);

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
