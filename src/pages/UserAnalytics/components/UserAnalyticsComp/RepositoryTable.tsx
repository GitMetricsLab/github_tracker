import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  Box,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Star, GitFork, Eye } from 'lucide-react';

interface Repository {
  name: string;
  description?: string;
  stars: number;
  forks: number;
  watchers: number;
  language?: string;
  html_url: string;
  updated_at: string;
}

interface RepositoryTableProps {
  repositories: Repository[];
}

const RepositoryTable: React.FC<RepositoryTableProps> = ({ repositories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!repositories || repositories.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top Repositories
        </Typography>
        <Typography color="textSecondary">
          No repository data available
        </Typography>
      </Paper>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#1976d2',
      'TypeScript': '#42A5F5',
      'Python': '#64B5F6',
      'Java': '#90CAF9',
      'C++': '#BBDEFB',
      'C#': '#1565c0',
      'PHP': '#2196F3',
      'Ruby': '#1e88e5',
      'Go': '#1976d2',
      'Rust': '#0d47a1',
    };
    return colors[language] || '#1976d2';
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        mb: 4, 
        borderRadius: 3,
        backgroundColor: '#000000',
        border: '1px solid #333333',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 6,
          transform: { xs: 'none', md: 'translateY(-2px)' },
          borderColor: '#1976d2'
        }
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ 
        color: '#1976d2', 
        fontWeight: 600, 
        mb: 3,
        fontSize: { xs: '1.1rem', md: '1.25rem' }
      }}>
        Top Repositories
      </Typography>
      
      {isMobile ? (
        // Mobile Card View
        <Grid container spacing={2}>
          {repositories.slice(0, 10).map((repo, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  backgroundColor: '#111111',
                  border: '1px solid #333333',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1a1a1a',
                    borderColor: '#1976d2',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Link
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1976d2',
                        fontSize: '1.1rem',
                        '&:hover': {
                          color: '#42A5F5'
                        }
                      }}
                    >
                      {repo.name}
                    </Link>
                    {repo.description && (
                      <Typography variant="body2" sx={{ 
                        color: '#CCCCCC', 
                        mt: 1, 
                        lineHeight: 1.4,
                        fontSize: '0.875rem'
                      }}>
                        {repo.description.length > 120 
                          ? `${repo.description.substring(0, 120)}...` 
                          : repo.description}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {repo.language && (
                      <Chip
                        label={repo.language}
                        size="small"
                        sx={{
                          backgroundColor: getLanguageColor(repo.language),
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                    <Typography variant="body2" sx={{ 
                      color: '#CCCCCC', 
                      fontSize: '0.75rem',
                      alignSelf: 'center'
                    }}>
                      Updated: {formatDate(repo.updated_at)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star size={14} color="#1976d2" fill="#1976d2" />
                      <Typography sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.875rem' }}>
                        {repo.stars}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GitFork size={14} color="#42A5F5" />
                      <Typography sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.875rem' }}>
                        {repo.forks}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Eye size={14} color="#64B5F6" />
                      <Typography sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.875rem' }}>
                        {repo.watchers}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop Table View
        <TableContainer sx={{ borderRadius: 2, border: '1px solid #333333', backgroundColor: '#111111' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1a1a1a' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.9rem', borderBottom: '1px solid #333333' }}>Repository</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.9rem', borderBottom: '1px solid #333333' }}>Language</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.9rem', borderBottom: '1px solid #333333' }}>Stars</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.9rem', borderBottom: '1px solid #333333' }}>Forks</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.9rem', borderBottom: '1px solid #333333' }}>Watchers</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.9rem', borderBottom: '1px solid #333333' }}>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repositories.slice(0, 10).map((repo, index) => (
              <TableRow 
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: '#0a0a0a',
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: '#111111',
                  },
                  '&:hover': {
                    backgroundColor: '#1a1a1a',
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s ease'
                  },
                  transition: 'all 0.2s ease',
                  '& td': {
                    borderBottom: '1px solid #333333'
                  }
                }}
              >
                <TableCell>
                  <Box>
                    <Link
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1976d2',
                        '&:hover': {
                          color: '#42A5F5'
                        }
                      }}
                    >
                      {repo.name}
                    </Link>
                    {repo.description && (
                      <Typography variant="body2" sx={{ color: '#CCCCCC', mt: 0.5, lineHeight: 1.4 }}>
                        {repo.description.length > 100 
                          ? `${repo.description.substring(0, 100)}...` 
                          : repo.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {repo.language && (
                    <Chip
                      label={repo.language}
                      size="small"
                      sx={{
                        backgroundColor: getLanguageColor(repo.language),
                        color: 'white',
                        fontWeight: 500,
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <Star size={16} color="#1976d2" fill="#1976d2" />
                    <Typography sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                      {repo.stars}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <GitFork size={16} color="#42A5F5" />
                    <Typography sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                      {repo.forks}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <Eye size={16} color="#64B5F6" />
                    <Typography sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                      {repo.watchers}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#CCCCCC', fontSize: '0.875rem' }}>
                    {formatDate(repo.updated_at)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default RepositoryTable;
