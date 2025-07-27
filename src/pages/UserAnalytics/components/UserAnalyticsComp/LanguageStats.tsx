import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LanguageStatsProps {
  languageStats: Record<string, number>;
}

const LanguageStats: React.FC<LanguageStatsProps> = ({ languageStats }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [languageStats]);

  if (!languageStats || Object.keys(languageStats).length === 0) {
    return (
      <Paper 
        elevation={8} 
        sx={{ 
          p: 5, 
          mb: 5, 
          borderRadius: 4,
          backgroundColor: '#1f2937',
          border: '2px solid #374151',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
          '&:hover': {
            elevation: 12,
            transform: 'translateY(-4px)',
            borderColor: '#3b82f6',
            boxShadow: '0 32px 64px -12px rgba(59, 130, 246, 0.15)'
          }
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ 
          color: '#3b82f6', 
          fontWeight: 700,
          fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
          fontSize: '1.5rem',
          letterSpacing: '-0.025em'
        }}>
          Programming Languages
        </Typography>
        <Typography sx={{ 
          color: '#d1d5db',
          fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
          fontSize: '1.1rem'
        }}>
          No language data available
        </Typography>
      </Paper>
    );
  }

  const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0);
  const languageEntries = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const modernColors = [
    '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', 
    '#f59e0b', '#ef4444', '#ec4899', '#6366f1'
  ];

  const pieData = languageEntries.map(([language, bytes], index) => ({
    name: language,
    value: bytes,
    percentage: ((bytes / totalBytes) * 100).toFixed(1),
    color: modernColors[index % modernColors.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          backgroundColor: '#1f2937',
          border: '2px solid #374151',
          borderRadius: 3,
          p: 2,
          color: '#f9fafb',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <Typography variant="body1" sx={{ 
            fontWeight: 700,
            fontSize: '1rem',
            color: data.color,
            mb: 0.5
          }}>
            {data.name}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#d1d5db',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            {data.percentage}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 3, sm: 4, md: 4 }, 
        mb: { xs: 3, sm: 4, md: 4 }, 
        borderRadius: { xs: 2, md: 3 },
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
        Programming Languages
      </Typography>
      
      <Box sx={{ 
        height: { xs: 300, sm: 350, md: 400 }, 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart 
            key={`pie-${animationKey}`}
            margin={{ 
              top: isMobile ? 10 : 20, 
              right: isMobile ? 10 : 20, 
              bottom: isMobile ? 10 : 20, 
              left: isMobile ? 10 : 20 
            }}
          >
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 90 : 140}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
              stroke="none"
              strokeWidth={0}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              position={{ x: 0, y: 0 }}
              allowEscapeViewBox={{ x: false, y: false }}
              wrapperStyle={{ 
                pointerEvents: 'none',
                zIndex: 1000
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={isMobile ? 28 : 36}
              formatter={(value: string) => {
                const dataItem = pieData.find(item => item.name === value);
                return (
                  <span style={{ 
                    color: '#FFFFFF', 
                    fontSize: isMobile ? '12px' : '14px' 
                  }}>
                    {value} ({dataItem?.percentage || '0'}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default LanguageStats;
