import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, CircularProgress } from '@mui/material';

interface UserFormProps {
  onSubmit: (username: string, token: string) => void;
  loading: boolean;
  initialUsername?: string;
  initialToken?: string;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  loading, 
  initialUsername = '', 
  initialToken = '' 
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [token, setToken] = useState(initialToken);

  // Update form when initial values change
  useEffect(() => {
    setUsername(initialUsername);
    setToken(initialToken);
  }, [initialUsername, initialToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, token);
  };

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
        transition: 'all 0.4s ease',
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        '&:hover': {
          elevation: 12,
          borderColor: '#3b82f6',
          transform: { xs: 'none', md: 'translateY(-2px)' },
          boxShadow: '0 32px 64px -12px rgba(59, 130, 246, 0.15)'
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 2, sm: 3 }, 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'end' }
        }}>
          <TextField
            label="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ 
              flex: { md: 1 }, 
              width: { xs: '100%', md: 'auto' },
              minWidth: { md: '280px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#374151',
                fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
                fontSize: '1rem',
                '& fieldset': {
                  borderColor: '#6b7280',
                  borderWidth: '2px'
                },
                '&:hover fieldset': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                  borderWidth: '2px'
                },
                '& input': {
                  color: '#f9fafb',
                  fontWeight: 500
                },
              },
              '& .MuiInputLabel-root': {
                color: '#d1d5db',
                fontWeight: 500,
                fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
                '&.Mui-focused': {
                  color: '#3b82f6',
                  fontWeight: 600
                }
              }
            }}
          />
          <TextField
            label="Personal Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type="password"
            required
            sx={{ 
              flex: { md: 1 }, 
              width: { xs: '100%', md: 'auto' },
              minWidth: { md: '280px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#374151',
                fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
                fontSize: '1rem',
                '& fieldset': {
                  borderColor: '#6b7280',
                  borderWidth: '2px'
                },
                '&:hover fieldset': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                  borderWidth: '2px'
                },
                '& input': {
                  color: '#f9fafb',
                  fontWeight: 500
                },
              },
              '& .MuiInputLabel-root': {
                color: '#d1d5db',
                fontWeight: 500,
                fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
                '&.Mui-focused': {
                  color: '#3b82f6',
                  fontWeight: 600
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ 
              minWidth: { xs: '100%', md: '160px' }, 
              width: { xs: '100%', md: 'auto' },
              height: { xs: '48px', md: '56px' },
              borderRadius: 3,
              backgroundColor: '#3b82f6',
              fontWeight: 700,
              fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
              textTransform: 'none',
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
              '&:hover': {
                backgroundColor: '#2563eb',
                transform: 'translateY(-3px)',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
              },
              '&:active': {
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                backgroundColor: '#4b5563',
                color: '#9ca3af',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Analytics'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UserForm;
