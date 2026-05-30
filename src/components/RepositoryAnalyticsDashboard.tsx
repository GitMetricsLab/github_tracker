import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, Grid, Paper, Theme, Typography } from '@mui/material';
import {
  Activity,
  Database,
  GitCommitVertical,
  GitFork,
  Languages,
  Star,
  TrendingUp,
} from 'lucide-react';

interface RepositorySummary {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  archived: boolean;
}

interface WeeklyCommitPoint {
  week: number;
  commits: number;
}

interface DashboardProps {
  totalIssues: number;
  totalPrs: number;
  repositories: RepositorySummary[];
  weeklyCommitActivity: WeeklyCommitPoint[];
  analyticsLoading: boolean;
  analyticsError: string;
  theme: Theme;
}

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

const formatWeekLabel = (week: number) =>
  new Date(week * 1000).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

const RepositoryAnalyticsDashboard = ({
  totalIssues,
  totalPrs,
  repositories,
  weeklyCommitActivity,
  analyticsLoading,
  analyticsError,
  theme,
}: DashboardProps) => {
  const totalContributions = totalIssues + totalPrs;

  const analytics = useMemo(() => {
    const repoCount = repositories.length;

    const totalStars = repositories.reduce((sum, repository) => sum + repository.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repository) => sum + repository.forks_count, 0);

    const languageCounts = new Map<string, number>();
    const monthlyBuckets = new Map<string, {
      label: string;
      order: number;
      created: number;
      stars: number;
      forks: number;
    }>();

    const sortedRepositories = [...repositories].sort(
      (left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
    );

    sortedRepositories.forEach((repository) => {
      const language = repository.language ?? 'Unknown';
      languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);

      const createdAt = new Date(repository.created_at);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyBuckets.has(monthKey)) {
        monthlyBuckets.set(monthKey, {
          label: formatMonthLabel(createdAt),
          order: createdAt.getFullYear() * 12 + createdAt.getMonth(),
          created: 0,
          stars: 0,
          forks: 0,
        });
      }

      const monthBucket = monthlyBuckets.get(monthKey);

      if (monthBucket) {
        monthBucket.created += 1;
        monthBucket.stars += repository.stargazers_count;
        monthBucket.forks += repository.forks_count;
      }
    });

    let cumulativeRepositories = 0;
    let cumulativeStars = 0;
    let cumulativeForks = 0;

    const repositoryGrowth = Array.from(monthlyBuckets.values())
      .sort((left, right) => left.order - right.order)
      .map((bucket) => {
        cumulativeRepositories += bucket.created;
        cumulativeStars += bucket.stars;
        cumulativeForks += bucket.forks;

        return {
          label: bucket.label,
          repositories: cumulativeRepositories,
          stars: cumulativeStars,
          forks: cumulativeForks,
        };
      });

    const languageDistribution = Array.from(languageCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value)
      .slice(0, 6);

    const topRepositories = [...repositories]
      .sort((left, right) => {
        if (right.stargazers_count !== left.stargazers_count) {
          return right.stargazers_count - left.stargazers_count;
        }

        return right.forks_count - left.forks_count;
      })
      .slice(0, 6)
      .map((repository) => ({
        name: repository.name,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        language: repository.language ?? 'Unknown',
      }));

    const mostUsedLanguage = languageDistribution[0]?.name ?? 'Unknown';

    return {
      repoCount,
      totalStars,
      totalForks,
      mostUsedLanguage,
      repositoryGrowth,
      languageDistribution,
      topRepositories,
    };
  }, [repositories]);

  const summaryCards = [
    {
      label: 'Total repositories',
      value: analytics.repoCount,
      icon: Database,
      accentStart: '#2563eb',
      accentEnd: '#06b6d4',
    },
    {
      label: 'Total stars',
      value: analytics.totalStars,
      icon: Star,
      accentStart: '#f59e0b',
      accentEnd: '#f97316',
    },
    {
      label: 'Total forks',
      value: analytics.totalForks,
      icon: GitFork,
      accentStart: '#10b981',
      accentEnd: '#14b8a6',
    },
    {
      label: 'Most used language',
      value: analytics.mostUsedLanguage,
      icon: Languages,
      accentStart: '#8b5cf6',
      accentEnd: '#d946ef',
    },
    {
      label: 'Total contributions',
      value: totalContributions,
      icon: Activity,
      accentStart: '#0ea5e9',
      accentEnd: '#6366f1',
    },
  ];

  const hasRepositoryData = analytics.repoCount > 0;
  const hasCommitData = weeklyCommitActivity.length > 0;

  if (analyticsLoading && !hasRepositoryData) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading repository analytics...
        </Typography>
      </Paper>
    );
  }

  if (!hasRepositoryData && totalContributions === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Enter a GitHub username to view repository growth analytics.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          mb: 3,
          p: { xs: 3, md: 4 },
          borderRadius: 6,
          color: 'white',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(29,78,216,0.92) 45%, rgba(8,145,178,0.9))',
          boxShadow: '0 24px 80px rgba(15,23,42,0.24)',
          border: '1px solid rgba(255,255,255,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.35,
            background:
              'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 34%), radial-gradient(circle at bottom left, rgba(34,197,94,0.22), transparent 28%)',
          }}
        />

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Box sx={{ px: 1.5, py: 0.7, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.14)', fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Repo Tracker
            </Box>
            <Box sx={{ px: 1.5, py: 0.7, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.1)', fontSize: 12, fontWeight: 600 }}>
              Growth analytics
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(0, 0.9fr)' }, alignItems: 'end' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.05, maxWidth: 720 }}>
                Track stars, forks, languages, and contribution momentum in one place.
              </Typography>
              <Typography sx={{ mt: 1.5, maxWidth: 760, color: 'rgba(255,255,255,0.8)' }}>
                This dashboard combines repository metadata with recent commit participation so you can spot growth, usage, and activity patterns without leaving the tracker.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box sx={{ minWidth: 92, px: 1.5, py: 1.2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Repos
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, mt: 0.5 }}>
                  {analytics.repoCount}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 92, px: 1.5, py: 1.2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Stars
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, mt: 0.5 }}>
                  {analytics.totalStars}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 92, px: 1.5, py: 1.2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Forks
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, mt: 0.5 }}>
                  {analytics.totalForks}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {analyticsError ? (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 3,
            border: '1px solid rgba(239,68,68,0.25)',
            background: 'rgba(239,68,68,0.08)',
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.error.main, fontWeight: 600 }}>
            {analyticsError}
          </Typography>
        </Paper>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(5, minmax(0, 1fr))',
          },
          mb: 3,
        }}
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Paper
              key={card.label}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 6,
                  background: `linear-gradient(180deg, ${card.accentStart}, ${card.accentEnd})`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, pl: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ letterSpacing: '0.18em', textTransform: 'uppercase', color: 'text.secondary' }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 900, lineHeight: 1 }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'white',
                    background: `linear-gradient(135deg, ${card.accentStart}, ${card.accentEnd})`,
                    boxShadow: '0 10px 22px rgba(0,0,0,0.12)',
                  }}
                >
                  <Icon size={19} />
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 430,
              borderRadius: 4,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(15,23,42,0.78), rgba(15,23,42,0.96))'
                  : 'linear-gradient(180deg, #ffffff, #f8fbff)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                height: 5,
                background: 'linear-gradient(90deg, #2563eb, #06b6d4, #10b981)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2.5, pt: 0.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Repository growth timeline
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cumulative repositories, stars, and forks over time.
                </Typography>
              </Box>
              <Box sx={{ width: 40, height: 40, borderRadius: 999, display: 'grid', placeItems: 'center', bgcolor: 'rgba(37,99,235,0.1)', color: 'primary.main' }}>
                <TrendingUp size={18} />
              </Box>
            </Box>

            {hasRepositoryData ? (
              <ResponsiveContainer width="100%" height="84%">
                <ComposedChart data={analytics.repositoryGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.8} />
                  <XAxis dataKey="label" stroke={theme.palette.text.secondary} tickMargin={10} />
                  <YAxis stroke={theme.palette.text.secondary} width={30} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 16, border: `1px solid ${theme.palette.divider}` }} />
                  <Legend />
                  <Area type="monotone" dataKey="repositories" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18} />
                  <Line type="monotone" dataKey="stars" stroke="#f59e0b" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="forks" stroke="#10b981" strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'grid', placeItems: 'center', height: '84%', borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }}>
                <Typography color="text.secondary">No repository timeline data available.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 430,
              borderRadius: 4,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
            }}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Language usage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Programming language distribution across owned repositories.
              </Typography>
            </Box>

            {analytics.languageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="82%">
                <PieChart>
                  <Pie
                    data={analytics.languageDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={68}
                    paddingAngle={5}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent && percent > 0.1 ? `${Math.round(percent * 100)}%` : ''}`}
                  >
                    {analytics.languageDistribution.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 16, border: `1px solid ${theme.palette.divider}` }} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'grid', placeItems: 'center', height: '82%', borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }}>
                <Typography color="text.secondary">No language data available.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 400,
              borderRadius: 4,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(15,23,42,0.72), rgba(15,23,42,0.94))'
                  : 'linear-gradient(180deg, #ffffff, #f9fbff)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
            }}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Commit activity trends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent weekly contribution intensity across the most active repositories.
              </Typography>
            </Box>

            {hasCommitData ? (
              <ResponsiveContainer width="100%" height="84%">
                <AreaChart data={weeklyCommitActivity.map((entry) => ({ label: formatWeekLabel(entry.week), commits: entry.commits }))}>
                  <defs>
                    <linearGradient id="commitFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.8} />
                  <XAxis dataKey="label" stroke={theme.palette.text.secondary} tickMargin={10} />
                  <YAxis stroke={theme.palette.text.secondary} width={30} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 16, border: `1px solid ${theme.palette.divider}` }} />
                  <Area type="monotone" dataKey="commits" stroke="#06b6d4" strokeWidth={3} fill="url(#commitFill)" dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'grid', placeItems: 'center', height: '84%', borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }}>
                <Typography color="text.secondary">Commit participation data is not available yet.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 400,
              borderRadius: 4,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
            }}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Star and fork growth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compare the most popular repositories in the current profile.
              </Typography>
            </Box>

            {analytics.topRepositories.length > 0 ? (
              <ResponsiveContainer width="100%" height="84%">
                <BarChart data={analytics.topRepositories}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.8} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} interval={0} angle={-15} textAnchor="end" height={70} tickMargin={10} />
                  <YAxis stroke={theme.palette.text.secondary} width={30} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 16, border: `1px solid ${theme.palette.divider}` }} />
                  <Legend />
                  <Bar dataKey="stars" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="forks" fill="#10b981" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'grid', placeItems: 'center', height: '84%', borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }}>
                <Typography color="text.secondary">No starred repository data found.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 4,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 12px 30px rgba(15,23,42,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Repository intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quick signals extracted from the current GitHub profile.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 999, bgcolor: 'rgba(37,99,235,0.08)', color: 'primary.main', fontWeight: 700 }}>
              <GitCommitVertical size={16} />
              Weekly commit trend
            </Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 999, bgcolor: 'rgba(16,185,129,0.08)', color: 'success.main', fontWeight: 700 }}>
              <TrendingUp size={16} />
              Growth timeline
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RepositoryAnalyticsDashboard;