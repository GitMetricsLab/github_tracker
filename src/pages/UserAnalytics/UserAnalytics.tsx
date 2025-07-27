import React, { useState, useEffect } from 'react';
import { Container, Alert, Box,Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UserForm from './components/UserAnalyticsComp/UserForm';
import UserProfile from './components/UserAnalyticsComp/UserProfile';
import UserStats from './components/UserAnalyticsComp/UserStats';
import LanguageStats from './components/UserAnalyticsComp/LanguageStats';
import ContributionStats from './components/UserAnalyticsComp/ContributionStats';
import RepositoryTable from './components/UserAnalyticsComp/RepositoryTable';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface UserData {
  profile: any;
  repositories: any[];
  languageStats: Record<string, number>;
  contributionStats: any;
  rankings: any;
  highlights: any;
  stars: any[];
  commitHistory: any[];
  socialStats: any;
}

const UserAnalytics: React.FC = () => {
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get username and token from navigation state
  const navigationState = location.state as { username?: string; token?: string } || {};
  const [initialUsername] = useState(navigationState.username || '');
  const [initialToken] = useState(navigationState.token || '');

  // Auto-fetch data if username and token are provided from Home page
  useEffect(() => {
    if (initialUsername && initialToken) {
      handleSubmit(initialUsername, initialToken);
    }
  }, [initialUsername, initialToken]);

  const handleSubmit = async (username: string, token: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${backendUrl}/api/github/user-profile`, {
        username,
        token
      });
      setUserData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: '#000000', 
      minHeight: '100vh',
      width: '100vw',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      <Container 
        maxWidth={false} 
        sx={{ 
          pt: 4, 
          pb: 6, 
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <UserForm 
          onSubmit={handleSubmit} 
          loading={loading} 
          initialUsername={initialUsername}
          initialToken={initialToken}
        />
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              backgroundColor: '#1f2937',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              fontWeight: 500,
              '& .MuiAlert-icon': {
                color: '#ef4444'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {userData && (
          <Box sx={{ 
            animation: 'fadeIn 0.8s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(30px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}>
            <UserProfile userData={userData} />
            <UserStats userData={userData} />
            <Grid container spacing={4}>
              <Grid item xs={12} lg={6}>
                <LanguageStats languageStats={userData.languageStats} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <ContributionStats contributionStats={userData.contributionStats} />
              </Grid>
            </Grid>
            <RepositoryTable repositories={userData.rankings.repositoryRanking} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UserAnalytics;