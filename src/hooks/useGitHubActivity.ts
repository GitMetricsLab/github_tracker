import { useMemo } from 'react';

export interface ActivityStatus {
  hasCommittedToday: boolean;
  hasOpenedPRToday: boolean;
  hasMergedPRToday: boolean;
  hasCreatedIssueToday: boolean;
  hasInteractedWithIssueToday: boolean;
  isInactiveToday: boolean;
  contributionStreak: number;
  todayActivityCount: number;
  lastActivityDate: string | null;
}

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

export const useGitHubActivity = (
  issues: GitHubItem[] = [],
  prs: GitHubItem[] = []
): ActivityStatus => {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check today's activity
    const todaysIssues = issues.filter((issue) => {
      const createdDate = new Date(issue.created_at);
      createdDate.setHours(0, 0, 0, 0);
      return createdDate.getTime() === today.getTime();
    });

    const todaysPRs = prs.filter((pr) => {
      const createdDate = new Date(pr.created_at);
      createdDate.setHours(0, 0, 0, 0);
      return createdDate.getTime() === today.getTime();
    });

    // Separate PR types for today
    const todaysOpenPRs = todaysPRs.filter((pr) => pr.state === 'open');
    
    // Compute merged PRs from all PRs by checking merged_at date (not created_at)
    // This captures PRs created earlier but merged today
    const todaysMergedPRs = prs.filter((pr) => {
      if (!pr.pull_request?.merged_at) return false;
      const mergedDate = new Date(pr.pull_request.merged_at);
      mergedDate.setHours(0, 0, 0, 0);
      return mergedDate.getTime() === today.getTime();
    });

    // Calculate activity flags
    const hasOpenedPRToday = todaysOpenPRs.length > 0;
    const hasMergedPRToday = todaysMergedPRs.length > 0;
    const hasCreatedIssueToday = todaysIssues.length > 0;
    const hasInteractedWithIssueToday = todaysIssues.length > 0;

    // For commits, we estimate based on PR and issue creation activity
    // (actual commits require different API endpoint)
    const hasCommittedToday = hasOpenedPRToday || hasMergedPRToday;

    const todayActivityCount = todaysIssues.length + todaysPRs.length;
    const isInactiveToday = todayActivityCount === 0;

    // Calculate contribution streak (consecutive days with activity)
    const allActivity = [...issues, ...prs].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    let contributionStreak = 0;
    if (allActivity.length > 0) {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // Check if there's activity today
      const hasActivityToday = allActivity.some((item) => {
        const itemDate = new Date(item.created_at);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === currentDate.getTime();
      });

      // Initialize streak based on activity today
      // If active today, start at 1 and move to yesterday for iteration
      // If inactive today, start at 0 and keep currentDate at today
      if (hasActivityToday) {
        contributionStreak = 1;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      // Count consecutive days backwards (regardless of activity today)
      for (const item of allActivity) {
        const itemDate = new Date(item.created_at);
        itemDate.setHours(0, 0, 0, 0);

        if (itemDate.getTime() === currentDate.getTime()) {
          contributionStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
      }
    }

    // Get last activity date
    const lastActivityDate =
      allActivity.length > 0
        ? new Date(allActivity[0].created_at).toLocaleDateString()
        : null;

    return {
      hasCommittedToday,
      hasOpenedPRToday,
      hasMergedPRToday,
      hasCreatedIssueToday,
      hasInteractedWithIssueToday,
      isInactiveToday,
      contributionStreak,
      todayActivityCount,
      lastActivityDate,
    };
  }, [issues, prs]);
};
