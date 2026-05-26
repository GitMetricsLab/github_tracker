import { useState, useCallback, useRef } from 'react';
import { Octokit } from '@octokit/core';

interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: {
    merged_at: string | null;
  };
  repository_url: string;
  html_url: string;
}

interface FetchFilters {
  search?: string;
  repo?: string;
  startDate?: string;
  endDate?: string;
  state?: string;
}

interface DailyActivity {
  commitCountToday: number;
  prOpenedToday: number;
  prMergedToday: number;
  issueActivityCountToday: number;
  streakCount: number;
  reminders: string[];
}

const initialDailyActivity: DailyActivity = {
  commitCountToday: 0,
  prOpenedToday: 0,
  prMergedToday: 0,
  issueActivityCountToday: 0,
  streakCount: 0,
  reminders: [],
};

const getDateKey = (date: Date): string =>
  date.toISOString().split('T')[0];

const buildDailyReminders = ({
  commitCountToday,
  prOpenedToday,
  prMergedToday,
  issueActivityCountToday,
}: DailyActivity): string[] => {
  const reminders: string[] = [];

  if (commitCountToday === 0) {
    reminders.push('🚀 You haven’t committed today');
  }
  if (prOpenedToday === 0) {
    reminders.push('💻 No pull request opened today');
  }
  if (prMergedToday === 0) {
    reminders.push('🎯 No PR merged today');
  }
  if (issueActivityCountToday === 0) {
    reminders.push('📌 Try contributing through issues');
  }
  if (
    commitCountToday === 0 &&
    prOpenedToday === 0 &&
    prMergedToday === 0 &&
    issueActivityCountToday === 0
  ) {
    reminders.push('🔥 Your contribution streak is at risk');
  }
  if (reminders.length > 0) {
    reminders.push('🏆 Keep your streak alive');
  }

  return reminders;
};

export const useGitHubData = (
  getOctokit: () => Octokit | null
) => {
  const [issues, setIssues] = useState<GitHubItem[]>([]);
  const [prs, setPrs] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPrs, setTotalPrs] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>(initialDailyActivity);
  const [dailyActivityLoaded, setDailyActivityLoaded] = useState(false);

  // Prevent stale responses overwriting latest data
  const lastRequestId = useRef(0);

  const fetchPaginated = async (
    octokit: Octokit,
    username: string,
    type: 'issue' | 'pr',
    page = 1,
    perPage = 10,
    filters: FetchFilters = {}
  ) => {
    let q = `author:${username} is:${type}`;

    if (filters.search) {
      q += ` ${filters.search} in:title`;
    }

    if (filters.repo) {
      q += ` repo:${filters.repo}`;
    }

    if (filters.startDate) {
      q += ` created:>=${filters.startDate}`;
    }

    if (filters.endDate) {
      q += ` created:<=${filters.endDate}`;
    }

    if (filters.state === 'open' || filters.state === 'closed') {
      q += ` is:${filters.state}`;
    }

    if (filters.state === 'merged' && type === 'pr') {
      q += ` is:merged`;
    }

    const response = await octokit.request(
      'GET /search/issues',
      {
        q,
        sort: 'created',
        order: 'desc',
        per_page: perPage,
        page,
      }
    );

    return {
      items: response.data.items as GitHubItem[],
      total: response.data.total_count,
    };
  };

  const getSearchCount = async (
    octokit: Octokit,
    endpoint: 'GET /search/issues' | 'GET /search/commits',
    q: string
  ) => {
    try {
      const response = await octokit.request(endpoint, {
        q,
        per_page: 1,
        headers:
          endpoint === 'GET /search/commits'
            ? {
                accept: 'application/vnd.github.cloak-preview+json',
              }
            : undefined,
      });

      return response.data.total_count ?? 0;
    } catch {
      return 0;
    }
  };

  const fetchStreakFromEvents = async (
    octokit: Octokit,
    username: string
  ) => {
    try {
      const response = await octokit.request('GET /users/{username}/events', {
        username,
        per_page: 100,
      });

      const eventDates = new Set<string>();
      response.data.forEach((event: any) => {
        const eventType = event.type;
        const createdAt = event.created_at;
        if (
          ['PushEvent', 'PullRequestEvent', 'IssuesEvent',
           'IssueCommentEvent', 'PullRequestReviewCommentEvent',
           'PullRequestReviewEvent'].includes(eventType) &&
          createdAt
        ) {
          eventDates.add(getDateKey(new Date(createdAt)));
        }
      });

      let streak = 0;
      for (let i = 0; i < 7; i += 1) {
        const day = getDateKey(
          new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        );
        if (eventDates.has(day)) {
          streak += 1;
        } else {
          break;
        }
      }

      return streak;
    } catch {
      return 0;
    }
  };

  const fetchDailyActivity = async (
    octokit: Octokit,
    username: string,
    requestId: number
  ) => {
    const today = getDateKey(new Date());

    const [
      issueCreatedToday,
      issueCommentedToday,
      prOpenedToday,
      prMergedToday,
    ] = await Promise.all([
      getSearchCount(
        octokit,
        'GET /search/issues',
        `author:${username} type:issue created:>=${today}`
      ),
      getSearchCount(
        octokit,
        'GET /search/issues',
        `commenter:${username} type:issue updated:>=${today}`
      ),
      getSearchCount(
        octokit,
        'GET /search/issues',
        `author:${username} type:pr created:>=${today}`
      ),
      getSearchCount(
        octokit,
        'GET /search/issues',
        `author:${username} type:pr is:merged merged:>=${today}`
      ),
    ]);

    const commitCountToday = await getSearchCount(
      octokit,
      'GET /search/commits',
      `author:${username} author-date:>=${today}`
    );

    const issueActivityCountToday = issueCreatedToday + issueCommentedToday;
    const streakCount = await fetchStreakFromEvents(octokit, username);

    if (requestId !== lastRequestId.current) {
      return;
    }

    setDailyActivity({
      commitCountToday,
      prOpenedToday,
      prMergedToday,
      issueActivityCountToday,
      streakCount,
      reminders: buildDailyReminders({
        commitCountToday,
        prOpenedToday,
        prMergedToday,
        issueActivityCountToday,
      }),
    });
    setDailyActivityLoaded(true);
  };

  const fetchData = useCallback(
    async (
      username: string,
      page = 1,
      perPage = 10,
      activeTab: 'issue' | 'pr' | 'both' = 'both',
      filters: FetchFilters = {}
    ) => {
      const octokit = getOctokit();

      if (!octokit || !username.trim() || rateLimited) {
        return;
      }

      const requestId = ++lastRequestId.current;

      setLoading(true);
      setError('');

      try {
        const shouldFetchIssues =
          activeTab === 'issue' || activeTab === 'both';

        const shouldFetchPrs =
          activeTab === 'pr' || activeTab === 'both';

        const requests: Promise<any>[] = [];

        if (shouldFetchIssues) {
          requests.push(
            fetchPaginated(
              octokit,
              username,
              'issue',
              page,
              perPage,
              filters
            )
          );
        }

        if (shouldFetchPrs) {
          requests.push(
            fetchPaginated(
              octokit,
              username,
              'pr',
              page,
              perPage,
              filters
            )
          );
        }

        requests.push(fetchDailyActivity(octokit, username, requestId));

        const results = await Promise.allSettled(requests);

        // Ignore stale requests
        if (requestId !== lastRequestId.current) {
          return;
        }

        let resultIndex = 0;

        if (shouldFetchIssues) {
          const issueResult = results[resultIndex];

          if (issueResult.status === 'fulfilled') {
            setIssues(issueResult.value.items);
            setTotalIssues(issueResult.value.total);
          } else {
            setIssues([]);
            setTotalIssues(0);
          }

          resultIndex++;
        }

        if (shouldFetchPrs) {
          const prResult = results[resultIndex];

          if (prResult.status === 'fulfilled') {
            setPrs(prResult.value.items);
            setTotalPrs(prResult.value.total);
          } else {
            setPrs([]);
            setTotalPrs(0);
          }
        }

        const hasRejected = results.some(
          (result) => result.status === 'rejected'
        );

        if (hasRejected) {
          setError(
            'Some GitHub data could not be fetched completely.'
          );
        }

        setRateLimited(false);
      } catch (err: unknown) {
        if (requestId !== lastRequestId.current) {
          return;
        }

        const error = err as {
          status?: number;
          message?: string;
        };

        const errorMessage =
          error.message?.toLowerCase() || '';

        if (error.status === 403) {
          setError(
            'GitHub API rate limit exceeded. Please provide a PAT to continue.'
          );
          setRateLimited(true);
        } else if (
          errorMessage.includes('do not exist')
        ) {
          setError(
            'User not found. Please check the GitHub username.'
          );
        } else if (
          errorMessage.includes('validation failed')
        ) {
          setError(
            'Invalid GitHub username or insufficient permissions.'
          );
        } else if (
          error.status === 401 ||
          errorMessage.includes('permission')
        ) {
          setError(
            'Private repository detected. Please provide a PAT.'
          );
        } else if (error.status === 404) {
          setError('Resource not found.');
        } else {
          setError(
            'Unable to fetch GitHub data. Please verify the username, token, or network connection.'
          );
        }
      } finally {
        if (requestId === lastRequestId.current) {
          setLoading(false);
        }
      }
    },
    [getOctokit, rateLimited]
  );

  return {
    issues,
    prs,
    totalIssues,
    totalPrs,
    loading,
    error,
    rateLimited,
    dailyActivity,
    dailyActivityLoaded,
    fetchData,
  };
};
