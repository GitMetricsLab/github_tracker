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
import { Paper, Typography, Box, Grid } from '@mui/material';

interface DashboardProps {
  totalIssues: number;
  totalPrs: number;
  data: any[]; // Combined issues and PRs from the current view
  theme: any;
}

const Dashboard: React.FC<DashboardProps> = ({ totalIssues, totalPrs, data, theme }) => {
  
  // Data for Pie Chart
  const pieData = [
    { name: 'Issues', value: totalIssues },
    { name: 'Pull Requests', value: totalPrs },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  // Data for Bar Chart (Top 5 Repositories in current view)
  const repoCounts: { [key: string]: number } = {};
  data.forEach(item => {
    const repoName = item.repository_url.split('/').slice(-1)[0];
    repoCounts[repoName] = (repoCounts[repoName] || 0) + 1;
  });

  const barData = Object.entries(repoCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {/* Pie Chart: Issues vs PRs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: 350, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom align="center">
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
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bar Chart: Activity by Repository */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: 350, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom align="center">
              Top Repositories (Current View)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
