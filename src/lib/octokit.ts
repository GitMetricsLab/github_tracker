import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { throttling } from "@octokit/plugin-throttling";
import { GITHUB_API_VERSION, GITHUB_API_BASE } from "../utils/constants";

const MyOctokit = Octokit.plugin(paginateRest, throttling);

// Make token optional; when empty/undefined we avoid sending an empty Authorization header
export const makeOctokit = (token?: string) =>
  new MyOctokit({
    auth: token || undefined,
    baseUrl: GITHUB_API_BASE,
    userAgent: "github-tracker/1.0",
    request: {
      // IMPORTANT: stops “deprecated / unversioned” warnings and aligns with fetch helpers
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    },
    throttle: {
      // Retry once on primary rate limit, then surface to caller
      onRateLimit: (retryAfter, options, octokit, retryCount?: number) => {
        const count = retryCount ?? 0;
        if (count === 0) {
          console.warn(
            `Rate Limit: ${options.method} ${options.url}. Retrying in ${retryAfter}s.`
          );
          return true; // single retry
        }
        return false;
      },
      // Retry once on secondary rate limit as well
      onSecondaryRateLimit: (_retryAfter, options) => {
        console.warn(
          `Secondary rate limit: ${options.method} ${options.url}.`
        );
        return true; // single retry
      },
    },
  });