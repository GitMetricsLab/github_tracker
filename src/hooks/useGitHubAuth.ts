import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Octokit } from '@octokit/core';

// Inactivity timeout in milliseconds (30 minutes).
// If the user has not interacted with the application for this period,
// the session credentials are cleared automatically. This limits the
// window during which a stolen or leaked token remains usable.
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const useGitHubAuth = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear credentials on session expiry.
  const clearSession = useCallback(() => {
    setUsername('');
    setToken('');
  }, []);

  // Reset the inactivity timer on every interaction.
  // The timer is only active when a username is set (i.e., a session exists).
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (username) {
      timeoutRef.current = setTimeout(clearSession, SESSION_TIMEOUT_MS);
    }
  }, [username, clearSession]);

  useEffect(() => {
    if (!username) {
      // No active session; clear any lingering timer.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Start the timer immediately when a session begins.
    resetTimer();

    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [username, resetTimer]);

  const octokit = useMemo(() => {
    if (!username) return null;
    if (token) {
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
    clearSession,
    getOctokit,
  };
};
