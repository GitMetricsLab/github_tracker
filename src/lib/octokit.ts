import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { throttling } from "@octokit/plugin-throttling";

const MyOctokit = Octokit.plugin(paginateRest, throttling);

export const makeOctokit = (token: string) =>
  new MyOctokit({
    auth: token,
    userAgent: "github-tracker/1.0",
    request: {
      // IMPORTANT: stops “deprecated / unversioned” warnings
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    },
    throttle: {
      onRateLimit: (retryAfter, options, octokit) => {
        console.warn(`Rate limit hit for ${options.method} ${options.url}. Retrying in ${retryAfter}s.`);
        return true; // auto-retry once
      },
      onSecondaryRateLimit: () => true,
    },
  });