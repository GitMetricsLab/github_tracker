import React from 'react';
import { calculateCodingPersona, ContributionItem } from '../utils/persona';
import { useTheme } from '@mui/material/styles';

interface CodingPersonaWidgetProps {
  issues?: ContributionItem[];
  pullRequests?: ContributionItem[];
}

export function CodingPersonaWidget({ issues = [], pullRequests = [] }: CodingPersonaWidgetProps) {
  // 🌟 Access the active Material UI theme context dynamically
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const allContributions = [...issues, ...pullRequests];
  const { personaTitle, earlyBirdPercent, nightOwlPercent, totalCount } = calculateCodingPersona(allContributions);

  if (totalCount === 0) return null;

  return (
    <div 
      className="w-full border rounded-xl p-6 mb-6 shadow-sm transition-all duration-300"
      style={{
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side: Details Text Box */}
        <div>
          <span 
            className="text-xs font-bold tracking-wider uppercase opacity-60"
            style={{ color: theme.palette.text.secondary }}
          >
            Developer Persona Analyzer
          </span>
          <h3 
            className="text-2xl font-black mt-1 tracking-tight"
            style={{ color: theme.palette.text.primary }}
          >
            {personaTitle}
          </h3>
          <p 
            className="text-xs mt-1 opacity-80"
            style={{ color: theme.palette.text.secondary }}
          >
            Calculated across {totalCount} records
          </p>
        </div>

        {/* Right Side: Progress Meter Sliders */}
        <div className="flex-1 max-w-md w-full">
          <div 
            className="flex justify-between text-xs font-semibold mb-2"
            style={{ color: theme.palette.text.secondary }}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-amber-400 rounded-full" />
              Morning: {earlyBirdPercent}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              Night: {nightOwlPercent}%
            </span>
          </div>
          
          {/* Outer Progress Track Backdrop */}
          <div 
            className="w-full rounded-full h-3.5 overflow-hidden flex border"
            style={{ 
              backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9', // slate-800 vs slate-100
              borderColor: theme.palette.divider 
            }}
          >
            <div 
              style={{ width: `${earlyBirdPercent}%` }} 
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-500 ease-out" 
            />
            <div 
              style={{ width: `${nightOwlPercent}%` }} 
              className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full transition-all duration-500 ease-out ml-auto" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}