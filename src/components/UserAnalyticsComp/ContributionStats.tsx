import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';

interface ContributionStatsProps {
  contributionStats: {
    pushEvents: number;
    pullRequestEvents: number;
    issueEvents: number;
    createEvents: number;
  };
}

const ContributionStats: React.FC<ContributionStatsProps> = ({ contributionStats }) => {
  const statsItems = [
    { label: 'Push Events', value: contributionStats.pushEvents },
    { label: 'Pull Requests', value: contributionStats.pullRequestEvents },
    { label: 'Issues', value: contributionStats.issueEvents },
    { label: 'Repositories Created', value: contributionStats.createEvents }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contribution Breakdown
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {statsItems.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>{item.label}:</Typography>
                  <Typography>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ContributionStats;