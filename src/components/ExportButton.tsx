import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import { Download, FileText, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportToCSV, exportToJSON, generateFilename } from '../utils/exportUtils';

interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
  user?: { login: string };
  labels?: Array<{ name: string }>;
}

interface ExportButtonProps {
  data: GitHubItem[];
  username: string;
  type: 'issues' | 'prs' | 'all';
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  username, 
  type, 
  disabled = false 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'csv' | 'json') => {
    try {
      const filename = generateFilename(username, type, format);
      
      if (format === 'csv') {
        exportToCSV(data, filename);
      } else {
        exportToJSON(data, filename);
      }
      
      toast.success(`Successfully exported ${data.length} items as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data. Please try again.');
      console.error('Export error:', error);
    }
    
    handleClose();
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Download size={16} />}
        onClick={handleClick}
        disabled={disabled || data.length === 0}
        sx={{ minWidth: 120 }}
      >
        Export
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem disabled sx={{ opacity: 0.7 }}>
          <Typography variant="caption" color="text.secondary">
            Export {data.length} items
          </Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <FileText size={16} />
          </ListItemIcon>
          <ListItemText primary="CSV Format" secondary="Spreadsheet compatible" />
        </MenuItem>
        
        <MenuItem onClick={() => handleExport('json')}>
          <ListItemIcon>
            <Code size={16} />
          </ListItemIcon>
          <ListItemText primary="JSON Format" secondary="Developer friendly" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ExportButton;