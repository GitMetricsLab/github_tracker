import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip
} from '@mui/material';

interface RepositoryTableProps {
  repositories: any[];
}

const RepositoryTable: React.FC<RepositoryTableProps> = ({ repositories }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Repositories by Stars
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Repository</TableCell>
                    <TableCell align="center">Stars</TableCell>
                    <TableCell align="center">Forks</TableCell>
                    <TableCell align="center">Language</TableCell>
                    <TableCell align="center">Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {repositories.map((repo: any) => (
                    <TableRow key={repo.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                              {repo.name}
                            </a>
                          </Typography>
                          {repo.description && (
                            <Typography variant="body2" color="text.secondary">
                              {repo.description.substring(0, 100)}...
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">{repo.stargazers_count}</TableCell>
                      <TableCell align="center">{repo.forks_count}</TableCell>
                      <TableCell align="center">
                        {repo.language && (
                          <Chip label={repo.language} size="small" />
                        )}
                      </TableCell>
                      <TableCell align="center">{formatDate(repo.updated_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RepositoryTable;