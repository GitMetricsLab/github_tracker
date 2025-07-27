import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip
} from '@mui/material';

interface UserProfileProps {
  userData: {
    profile: any;
    socialStats: any;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              src={userData.profile.avatar_url}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {userData.profile.name || userData.profile.login}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{userData.profile.login}
            </Typography>
            {userData.profile.bio && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                {userData.profile.bio}
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Chip label={`${userData.socialStats.followers} Followers`} />
              <Chip label={`${userData.socialStats.following} Following`} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserProfile;