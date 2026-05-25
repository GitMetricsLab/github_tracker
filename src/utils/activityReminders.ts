import { ActivityStatus } from '../hooks/useGitHubActivity';

export interface ReminderMessage {
  icon: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  type: string;
}

export interface StreakData {
  currentStreak: number;
  isStreakAtRisk: boolean;
  streakMessage: string;
}

/**
 * Generate motivational reminder messages based on activity status
 */
export const generateReminders = (
  activity: ActivityStatus
): ReminderMessage[] => {
  const reminders: ReminderMessage[] = [];

  if (activity.isInactiveToday) {
    // No activity today
    reminders.push({
      icon: '📌',
      message: 'Time to make your first contribution today',
      severity: 'warning',
      type: 'inactivity',
    });
  } else {
    // Has activity - provide positive reinforcement
    reminders.push({
      icon: '🔥',
      message: `Great start! You've contributed ${activity.todayActivityCount} time(s) today`,
      severity: 'success',
      type: 'achievement',
    });
  }

  // Specific activity reminders
  if (!activity.hasCommittedToday && !activity.isInactiveToday) {
    reminders.push({
      icon: '🚀',
      message: "You haven't committed today",
      severity: 'info',
      type: 'commit',
    });
  }

  if (!activity.hasOpenedPRToday && !activity.isInactiveToday) {
    reminders.push({
      icon: '💻',
      message: 'No pull requests opened today',
      severity: 'info',
      type: 'pr',
    });
  }

  if (!activity.hasCreatedIssueToday && activity.isInactiveToday) {
    reminders.push({
      icon: '📝',
      message: 'Consider creating or working on an issue',
      severity: 'info',
      type: 'issue',
    });
  }

  return reminders;
};

/**
 * Generate streak data and motivational message
 */
export const generateStreakData = (
  activity: ActivityStatus
): StreakData => {
  const currentStreak = activity.contributionStreak;
  const isStreakAtRisk = activity.isInactiveToday && currentStreak > 0;

  let streakMessage = '';

  if (currentStreak === 0) {
    streakMessage = 'Start your contribution streak today!';
  } else if (currentStreak === 1) {
    streakMessage = '🎯 You have a 1-day streak! Keep it going!';
  } else if (currentStreak < 7) {
    streakMessage = `🔥 ${currentStreak}-day streak! You're on a roll!`;
  } else if (currentStreak < 30) {
    streakMessage = `🚀 ${currentStreak}-day streak! Amazing consistency!`;
  } else if (currentStreak < 100) {
    streakMessage = `💪 ${currentStreak}-day streak! You're a contribution machine!`;
  } else {
    streakMessage = `👑 ${currentStreak}-day streak! Legendary contributor!`;
  }

  if (isStreakAtRisk) {
    streakMessage += ' ⚠️ Your streak is at risk!';
  }

  return {
    currentStreak,
    isStreakAtRisk,
    streakMessage,
  };
};

/**
 * Get activity summary text
 */
export const getActivitySummary = (activity: ActivityStatus): string => {
  if (activity.isInactiveToday) {
    return 'No contributions today';
  }

  const parts: string[] = [];

  if (activity.hasCommittedToday) {
    parts.push('Commits made');
  }
  if (activity.hasOpenedPRToday) {
    parts.push('PRs opened');
  }
  if (activity.hasMergedPRToday) {
    parts.push('PRs merged');
  }
  if (activity.hasCreatedIssueToday) {
    parts.push('Issues created');
  }

  if (parts.length === 0) {
    return 'Some contributions today';
  }

  return parts.join(' • ');
};

/**
 * Get color based on activity level
 */
export const getActivityColor = (
  activity: ActivityStatus
): 'error' | 'warning' | 'success' | 'info' => {
  if (activity.isInactiveToday) {
    return 'error';
  }

  if (activity.todayActivityCount === 1) {
    return 'warning';
  }

  if (activity.todayActivityCount >= 2) {
    return 'success';
  }

  return 'info';
};

/**
 * Calculate productivity score based on activity
 */
export const calculateProductivityScore = (
  activity: ActivityStatus
): number => {
  let score = 0;

  if (activity.hasCommittedToday) score += 25;
  if (activity.hasOpenedPRToday) score += 25;
  if (activity.hasMergedPRToday) score += 25;
  if (activity.hasCreatedIssueToday) score += 25;

  // Bonus for consistency
  if (activity.contributionStreak >= 7) score += 10;
  if (activity.contributionStreak >= 30) score += 20;
  if (activity.contributionStreak >= 100) score += 30;

  return Math.min(score, 100);
};

/**
 * Get motivation level based on streak
 */
export const getMotivationLevel = (
  streak: number
): 'low' | 'medium' | 'high' | 'legendary' => {
  if (streak === 0) return 'low';
  if (streak < 7) return 'medium';
  if (streak < 30) return 'high';
  return 'legendary';
};
