import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  CheckCircleIcon,
  FlameIcon,
  AlertCircleIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { ActivityStatus } from '../hooks/useGitHubActivity';
import {
  generateReminders,
  generateStreakData,
  getActivitySummary,
  getActivityColor,
  calculateProductivityScore,
} from '../utils/activityReminders';

interface ActivityReminderProps {
  activity: ActivityStatus;
}

const ActivityReminder: React.FC<ActivityReminderProps> = ({
  activity,
}) => {
  const theme = useTheme();
  const reminders = useMemo(() => generateReminders(activity), [activity]);
  const streakData = useMemo(() => generateStreakData(activity), [activity]);
  const activitySummary = useMemo(
    () => getActivitySummary(activity),
    [activity]
  );
  const activityColor = useMemo(() => getActivityColor(activity), [activity]);
  const productivityScore = useMemo(
    () => calculateProductivityScore(activity),
    [activity]
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStreakColor = () => {
    if (streakData.isStreakAtRisk) return 'error';
    if (streakData.currentStreak >= 30) return 'success';
    if (streakData.currentStreak >= 7) return 'warning';
    return 'default';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TrendingUpIcon size={20} />
        Daily Activity Status
      </Typography>

      <Grid container spacing={2}>
        {/* Main Activity Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderLeft: `4px solid ${
                theme.palette[activityColor]?.main || theme.palette.info.main
              }`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {activity.isInactiveToday ? (
                  <AlertCircleIcon size={32} color={theme.palette.error.main} />
                ) : (
                  <CheckCircleIcon
                    size={32}
                    color={theme.palette.success.main}
                  />
                )}
                <Box flex={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Today's Activity
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {activity.todayActivityCount === 0
                      ? 'No contributions'
                      : `${activity.todayActivityCount} contribution${activity.todayActivityCount !== 1 ? 's' : ''}`}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                {activitySummary}
              </Typography>

              {activity.lastActivityDate && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  Last activity: {activity.lastActivityDate}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Streak & Productivity Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderLeft: `4px solid ${theme.palette.warning.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <FlameIcon
                  size={32}
                  color={getStreakColor() === 'error' ? theme.palette.error.main : theme.palette.warning.main}
                />
                <Box flex={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Contribution Streak
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                <Chip
                  label={`${streakData.currentStreak}🔥`}
                  color={getStreakColor()}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                  fontStyle: 'italic',
                }}
              >
                {streakData.streakMessage}
              </Typography>

              {/* Productivity Score */}
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Productivity Score
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {productivityScore}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={productivityScore}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        productivityScore >= 75
                          ? theme.palette.success.main
                          : productivityScore >= 50
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Reminders Section */}
        {reminders.length > 0 && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Activity Reminders
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {reminders.map((reminder, index) => (
                <Alert
                  key={index}
                  severity={getSeverityColor(reminder.severity)}
                  sx={{
                    backgroundColor: `${theme.palette[getSeverityColor(reminder.severity)].main}15`,
                    borderColor: theme.palette[getSeverityColor(reminder.severity)].main,
                    borderLeft: `3px solid ${theme.palette[getSeverityColor(reminder.severity)].main}`,
                    '& .MuiAlert-icon': {
                      color: theme.palette[getSeverityColor(reminder.severity)].main,
                    },
                  }}
                  icon={<Box sx={{ fontSize: '1.25rem' }}>{reminder.icon}</Box>}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {reminder.message}
                  </Typography>
                </Alert>
              ))}
            </Box>
          </Grid>
        )}

        {/* Activity Breakdown */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Activity Breakdown
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: activity.hasCommittedToday
                        ? `${theme.palette.success.main}15`
                        : theme.palette.background.default,
                      borderRadius: 1,
                      border: `1px solid ${activity.hasCommittedToday ? theme.palette.success.main : theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      Commits
                    </Typography>
                    <Chip
                      size="small"
                      label={activity.hasCommittedToday ? '✓' : '○'}
                      color={activity.hasCommittedToday ? 'success' : 'default'}
                      variant={activity.hasCommittedToday ? 'filled' : 'outlined'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: activity.hasOpenedPRToday
                        ? `${theme.palette.success.main}15`
                        : theme.palette.background.default,
                      borderRadius: 1,
                      border: `1px solid ${activity.hasOpenedPRToday ? theme.palette.success.main : theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      PRs Opened
                    </Typography>
                    <Chip
                      size="small"
                      label={activity.hasOpenedPRToday ? '✓' : '○'}
                      color={activity.hasOpenedPRToday ? 'success' : 'default'}
                      variant={activity.hasOpenedPRToday ? 'filled' : 'outlined'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: activity.hasMergedPRToday
                        ? `${theme.palette.success.main}15`
                        : theme.palette.background.default,
                      borderRadius: 1,
                      border: `1px solid ${activity.hasMergedPRToday ? theme.palette.success.main : theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      PRs Merged
                    </Typography>
                    <Chip
                      size="small"
                      label={activity.hasMergedPRToday ? '✓' : '○'}
                      color={activity.hasMergedPRToday ? 'success' : 'default'}
                      variant={activity.hasMergedPRToday ? 'filled' : 'outlined'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: activity.hasCreatedIssueToday
                        ? `${theme.palette.success.main}15`
                        : theme.palette.background.default,
                      borderRadius: 1,
                      border: `1px solid ${activity.hasCreatedIssueToday ? theme.palette.success.main : theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      Issues
                    </Typography>
                    <Chip
                      size="small"
                      label={activity.hasCreatedIssueToday ? '✓' : '○'}
                      color={activity.hasCreatedIssueToday ? 'success' : 'default'}
                      variant={activity.hasCreatedIssueToday ? 'filled' : 'outlined'}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActivityReminder;
