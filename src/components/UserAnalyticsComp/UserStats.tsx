import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import { Star, GitFork, Code, Activity } from 'lucide-react';

interface UserStatsProps {
  userData: {
    rankings: any;
    contributionStats: any;
  };
}

const UserStats: React.FC<UserStatsProps> = ({ userData }) => {
  const statsData = [
    {
      icon: <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />,
      value: userData.rankings.totalStars,
      label: 'Total Stars'
    },
    {
      icon: <GitFork className="w-8 h-8 mx-auto mb-2 text-blue-500" />,
      value: userData.rankings.totalForks,
      label: 'Total Forks'
    },
    {
      icon: <Code className="w-8 h-8 mx-auto mb-2 text-green-500" />,
      value: userData.rankings.publicRepos,
      label: 'Public Repos'
    },
    {
      icon: <Activity className="w-8 h-8 mx-auto mb-2 text-purple-500" />,
      value: userData.contributionStats.totalEvents,
      label: 'Activities'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {stat.icon}
              <Typography variant="h4">{stat.value}</Typography>
              <Typography variant="body2">{stat.label}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserStats;