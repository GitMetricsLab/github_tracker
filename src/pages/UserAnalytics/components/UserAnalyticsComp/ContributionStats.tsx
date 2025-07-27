import React from 'react';
import { Paper, Typography, Grid, Box, Chip } from '@mui/material';
import { Calendar, GitCommit, TrendingUp } from 'lucide-react';

interface ContributionStatsProps {
  contributionStats: {
    totalContributions?: number;
    longestStreak?: number;
    currentStreak?: number;
    mostActiveDay?: string;
    averagePerDay?: number;
  };
}

const ContributionStats: React.FC<ContributionStatsProps> = ({ contributionStats }) => {
  if (!contributionStats) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          backgroundColor: '#000000',
          border: '1px solid #333333',
          transition: 'all 0.3s ease',
          '&:hover': {
            elevation: 6,
            transform: 'translateY(-2px)',
            borderColor: '#1976d2'
          }
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
          Contribution Statistics
        </Typography>
        <Typography sx={{ color: '#CCCCCC' }}>
          No contribution data available
        </Typography>
      </Paper>
    );
  }

  const {
    totalContributions = 0,
    longestStreak = 0,
    currentStreak = 0,
    mostActiveDay = 'N/A',
    averagePerDay = 0
  } = contributionStats;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3,
        backgroundColor: '#000000',
        border: '1px solid #333333',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 6,
          transform: 'translateY(-2px)',
          borderColor: '#1976d2'
        }
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
        Contribution Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ 
            textAlign: 'center', 
            p: 3,
            borderRadius: 2,
            backgroundColor: '#111111',
            border: '1px solid #333333',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#1a1a1a',
              transform: 'scale(1.02)',
              borderColor: '#1976d2'
            }
          }}>
            <Box sx={{ 
              color: '#1976d2', 
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              '& svg': {
                filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.5))'
              }
            }}>
              <GitCommit size={36} />
            </Box>
            <Typography variant="h4" component="div" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
              {totalContributions.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCCCCC', fontWeight: 500 }}>
              Total Contributions
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ 
            textAlign: 'center', 
            p: 3,
            borderRadius: 2,
            backgroundColor: '#111111',
            border: '1px solid #333333',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#1a1a1a',
              transform: 'scale(1.02)',
              borderColor: '#1976d2'
            }
          }}>
            <Box sx={{ 
              color: '#42A5F5', 
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              '& svg': {
                filter: 'drop-shadow(0 2px 8px rgba(66, 165, 245, 0.5))'
              }
            }}>
              <TrendingUp size={36} />
            </Box>
            <Typography variant="h4" component="div" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
              {longestStreak}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCCCCC', fontWeight: 500 }}>
              Longest Streak (days)
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ 
            textAlign: 'center', 
            p: 3,
            borderRadius: 2,
            backgroundColor: '#111111',
            border: '1px solid #333333',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#1a1a1a',
              transform: 'scale(1.02)',
              borderColor: '#1976d2'
            }
          }}>
            <Box sx={{ 
              color: '#64B5F6', 
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              '& svg': {
                filter: 'drop-shadow(0 2px 8px rgba(100, 181, 246, 0.5))'
              }
            }}>
              <Calendar size={36} />
            </Box>
            <Typography variant="h4" component="div" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
              {currentStreak}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCCCCC', fontWeight: 500 }}>
              Current Streak (days)
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip 
          label={`Most Active: ${mostActiveDay}`} 
          variant="outlined" 
          sx={{
            borderColor: '#1976d2',
            color: '#1976d2',
            backgroundColor: '#111111',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#1a1a1a',
              borderColor: '#42A5F5'
            }
          }}
        />
        <Chip 
          label={`Avg: ${averagePerDay.toFixed(1)} contributions/day`} 
          variant="outlined" 
          sx={{
            borderColor: '#42A5F5',
            color: '#42A5F5',
            backgroundColor: '#111111',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#1a1a1a',
              borderColor: '#64B5F6'
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default ContributionStats;
