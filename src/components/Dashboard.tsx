import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box, Grid, Theme } from '@mui/material';

interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
}

interface DashboardProps {
  totalIssues: number;
  totalPrs: number;
  data: GitHubItem[];
  theme: Theme;
}

export const getTotalActiveDays = (issues: GitHubItem[], prs: GitHubItem[]) => {
  const activeDays = new Set<string>();

  [...issues, ...prs].forEach((item) => {
    const activityDate = item?.created_at?.slice(0, 10);

    if (activityDate) {
      activeDays.add(activityDate);
    }
  });

  return activeDays.size;
};

const Dashboard: React.FC<DashboardProps> = ({ totalIssues, totalPrs, data, theme }) => {
  const totalContributions = totalIssues + totalPrs;

  // Data for Pie Chart
  const pieData = [
    { name: 'Issues', value: totalIssues },
    { name: 'Pull Requests', value: totalPrs },
  ];

  // Use theme-aware colors
  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];

  // Data for Bar Chart (Top 5 Repositories) - Improved safety
  const repoCounts: { [key: string]: number } = {};
  data.forEach(item => {
    if (item?.repository_url) {
      const repoName = item.repository_url
        .split('/')
        .filter(Boolean)
        .pop();
      
      if (repoName) {
        repoCounts[repoName] = (repoCounts[repoName] || 0) + 1;
      }
    }
  });

  const barData = Object.entries(repoCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const hasData = totalIssues > 0 || totalPrs > 0;

  const renderChartCard = (
    title: string,
    subtitle: string,
    content: React.ReactNode
  ) => (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2.5, sm: 3 },
        height: '100%',
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 320, minWidth: 0 }}>
        {content}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ mb: 4 }}>
      {!hasData && (
        <Paper elevation={1} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: theme.palette.background.paper }}>
          <Typography variant="h6" color="textSecondary">
            No data available. Enter a username to view analytics.
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          {renderChartCard(
            'Contribution Mix',
            `Total activity across ${totalContributions} items`,
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ flex: 1, minHeight: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      fill={theme.palette.primary.main}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 1, px: 1 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Issues
                  </Typography>
                  <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {totalIssues}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="textSecondary">
                    Pull Requests
                  </Typography>
                  <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {totalPrs}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {renderChartCard(
            'Top Repositories',
            'Current view broken down by repository activity',
            barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal={false} />
                  <XAxis type="number" stroke={theme.palette.text.secondary} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke={theme.palette.text.secondary} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
                  />
                  <Bar dataKey="count" fill={theme.palette.primary.main} radius={[0, 8, 8, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="textSecondary">No repository data found in this view.</Typography>
              </Box>
            )
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
