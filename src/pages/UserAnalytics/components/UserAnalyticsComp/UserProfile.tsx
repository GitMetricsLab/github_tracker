import React from 'react';
import { Box, Paper, Avatar, Typography, Chip, Grid } from '@mui/material';

interface UserProfileProps {
  userData: {
    profile: any;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const { profile } = userData;

  return (
    <Paper 
      elevation={8} 
      sx={{ 
        p: { xs: 3, sm: 4, md: 5 }, 
        mb: { xs: 3, sm: 4, md: 5 }, 
        borderRadius: { xs: 3, md: 4 },
        backgroundColor: '#1f2937',
        border: '2px solid #374151',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
        '&:hover': {
          elevation: 12,
          borderColor: '#3b82f6',
          transform: { xs: 'none', md: 'translateY(-4px)' },
          boxShadow: '0 32px 64px -12px rgba(59, 130, 246, 0.15)'
        }
      }}
    >
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
        <Grid item xs={12} sm="auto">
          <Box sx={{ 
            position: 'relative',
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}>
            <Avatar
              src={profile.avatar_url}
              alt={profile.name}
              sx={{ 
                width: { xs: 100, sm: 120, md: 140 }, 
                height: { xs: 100, sm: 120, md: 140 },
                border: '4px solid #3b82f6',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: { xs: 'scale(1.05)', md: 'scale(1.08)' },
                  boxShadow: '0 25px 50px rgba(59, 130, 246, 0.6)',
                  borderColor: '#60a5fa'
                }
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" gutterBottom sx={{ 
              color: '#f9fafb', 
              fontWeight: 800,
              fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              letterSpacing: '-0.025em',
              background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {profile.name || profile.login}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#3b82f6', 
              mb: { xs: 2, md: 3 }, 
              fontWeight: 600,
              fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}>
              @{profile.login}
            </Typography>
          {profile.bio && (
            <Typography variant="body1" sx={{ 
              mb: 4, 
              color: '#d1d5db', 
              lineHeight: 1.7,
              fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
              fontSize: '1.1rem',
              fontWeight: 400
            }}>
              {profile.bio}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Chip 
              label={`${profile.public_repos || 0} Repositories`} 
              variant="filled"
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'scale(1.05)'
                }
              }}
            />
            <Chip 
              label={`${profile.followers || 0} Followers`} 
              variant="outlined"
              sx={{
                borderColor: '#42A5F5',
                color: '#42A5F5',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#111111',
                  transform: 'scale(1.05)'
                }
              }}
            />
            <Chip 
              label={`${profile.following || 0} Following`} 
              variant="outlined"
              sx={{
                borderColor: '#64B5F6',
                color: '#64B5F6',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#111111',
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfile;
