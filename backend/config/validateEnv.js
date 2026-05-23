/**
 * Validates required environment variables before the server starts.
 * Throws so callers can decide whether to log + exit or handle otherwise,
 * which keeps the logic unit-testable without spawning child processes.
 */
function validateEnv() {
  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_ORIGIN) {
    throw new Error(
      'FRONTEND_ORIGIN environment variable is required in production. ' +
      'Set it to the URL of your frontend (e.g., https://app.example.com).'
    );
  }
}

module.exports = { validateEnv };
