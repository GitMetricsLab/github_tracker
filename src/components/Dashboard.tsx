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

const Dashboard: React.FC<DashboardProps> = ({ totalIssues, totalPrs, data, theme }) => {
  
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

  if (!hasData) {
    return (
      <Paper elevation={1} sx={{ p: 4, mb: 4, textAlign: 'center', backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6" color="textSecondary">
          No data available. Enter a username to view analytics.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {/* Pie Chart: Issues vs PRs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: 350, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom align="center" color="textPrimary">
              Contribution Mix (Total)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill={theme.palette.primary.main}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bar Chart: Activity by Repository */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: 350, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom align="center" color="textPrimary">
              Top Repositories (Current View)
            </Typography>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
                  />
                  <Bar dataKey="count" fill={theme.palette.primary.light} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                 <Typography color="textSecondary">No repository data found in this view.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
