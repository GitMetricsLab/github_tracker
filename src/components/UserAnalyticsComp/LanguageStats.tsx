import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';

interface LanguageStatsProps {
  languageStats: Record<string, number>;
}

const LanguageStats: React.FC<LanguageStatsProps> = ({ languageStats }) => {
  const getTopLanguages = (languageStats: Record<string, number>) => {
    const total = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0);
    return Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language, bytes]) => ({
        language,
        percentage: ((bytes / total) * 100).toFixed(1)
      }));
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Programming Languages
            </Typography>
            {getTopLanguages(languageStats).map(({ language, percentage }) => (
              <Box key={language} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{language}</Typography>
                  <Typography variant="body2">{percentage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(percentage)} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LanguageStats;