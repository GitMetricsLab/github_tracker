import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

interface UserFormProps {
  onSubmit: (username: string, token: string) => void;
  loading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, loading }) => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, token);
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          GitHub User Analytics
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <TextField
              label="Personal Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              required
              sx={{ flex: 1 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ minWidth: '120px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;