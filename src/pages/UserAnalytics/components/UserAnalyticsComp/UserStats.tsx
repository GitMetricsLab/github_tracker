import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Star, GitFork, Eye, Users } from 'lucide-react';

interface UserStatsProps {
  userData: {
    rankings: any;
    highlights: any;
    socialStats: any;
    stars: any[];
  };
}

const UserStats: React.FC<UserStatsProps> = ({ userData }) => {
  const { rankings, socialStats, stars } = userData;

  const statCards = [
    {
      title: 'Total Stars',
      value: stars?.length || 0,
      icon: <Star size={32} />,
      color: '#3b82f6',
      bgColor: '#1f2937',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    },
    {
      title: 'Repositories',
      value: rankings?.repositoryRanking?.length || 0,
      icon: <GitFork size={32} />,
      color: '#8b5cf6',
      bgColor: '#1f2937',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
      title: 'Watchers',
      value: socialStats?.totalWatchers || 0,
      icon: <Eye size={32} />,
      color: '#06b6d4',
      bgColor: '#1f2937',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
    },
    {
      title: 'Forks',
      value: socialStats?.totalForks || 0,
      icon: <Users size={32} />,
      color: '#10b981',
      bgColor: '#1f2937',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    }
  ];

  return (
    <Grid container spacing={4} sx={{ mb: 5 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper 
            elevation={8}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 4,
              backgroundColor: '#1f2937',
              border: '2px solid #374151',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: stat.gradient,
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.4s ease'
              },
              '&:hover': {
                elevation: 12,
                transform: 'translateY(-8px)',
                backgroundColor: '#374151',
                borderColor: stat.color,
                boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3)`,
                '&::before': {
                  transform: 'scaleX(1)'
                }
              }
            }}
          >
            <Box sx={{ 
              color: stat.color, 
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              '& svg': {
                filter: `drop-shadow(0 4px 12px ${stat.color}40)`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                  filter: `drop-shadow(0 6px 20px ${stat.color}60)`
                }
              }
            }}>
              {stat.icon}
            </Box>
            <Typography variant="h3" component="div" gutterBottom sx={{ 
              color: '#f9fafb', 
              fontWeight: 800,
              fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              letterSpacing: '-0.025em',
              background: stat.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#d1d5db',
              fontWeight: 600,
              fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
              fontSize: '1rem',
              letterSpacing: '0.025em',
              textTransform: 'uppercase'
            }}>
              {stat.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserStats;
