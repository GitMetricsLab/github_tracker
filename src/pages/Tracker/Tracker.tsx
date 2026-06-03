import React, { useState, useEffect } from "react"
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitMergeIcon,
} from '@primer/octicons-react';
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Link,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import { KeyIcon, Search, Filter } from "lucide-react";

const ROWS_PER_PAGE = 10;

interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
}

const Home: React.FC = () => {

  const theme = useTheme();

  const {
    username,
    setUsername,
    token,
    setToken,
    error: authError,
    getOctokit,
  } = useGitHubAuth();

  const {
    issues,
    prs,
    totalIssues,
    totalPrs,
    loading,
    error: dataError,
    fetchData,
  } = useGitHubData(getOctokit);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);

  const [issueFilter, setIssueFilter] = useState("all");
  const [prFilter, setPrFilter] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch data when username, tab, or page changes
  useEffect(() => {
    if (username) {
      fetchData(username, page + 1, ROWS_PER_PAGE);
    }
  }, [tab, page]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setPage(0);
    fetchData(username, 1, ROWS_PER_PAGE);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString();

  const filterData = (data: GitHubItem[], filterType: string): GitHubItem[] => {
    let filtered = [...data];
    if (["open", "closed", "merged"].includes(filterType)) {
      filtered = filtered.filter((item) => {
        if (filterType === "merged") {
          return !!item.pull_request?.merged_at
        }
        else if (filterType === "closed") {
          return item.state === "closed" && !item.pull_request?.merged_at
        }
        else {
          //open
          return item.state === "open"
        }
      });
    }
    if (searchTitle) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (selectedRepo) {
      filtered = filtered.filter((item) =>
        item.repository_url.includes(selectedRepo)
      );
    }
    if (startDate) {
      filtered = filtered.filter(
        (item) => new Date(item.created_at) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (item) => new Date(item.created_at) <= new Date(endDate)
      );
    }
    return filtered;
  };

  const getStatusIcon = (item: GitHubItem) => {

    if (item.pull_request) {

        if (item.pull_request.merged_at)
            return <GitMergeIcon size={16} className="icon-merged" />;

        if (item.state === 'closed')
            return <GitPullRequestClosedIcon size={16} className="icon-pr-closed" />;

        return <GitPullRequestIcon size={16} className="icon-pr-open" />;
    }

    if (item.state === 'closed')
        return <IssueClosedIcon size={16} className="icon-issue-closed" />;

    return <IssueOpenedIcon size={16} className="icon-issue-open" />;
  };


  // Current data and filtered data according to tab and filters
  const currentRawData = tab === 0 ? issues : prs;
  const currentFilteredData = filterData(currentRawData, tab === 0 ? issueFilter : prFilter);
  const totalCount = tab === 0 ? totalIssues : totalPrs;

  // Helper function to get status badge color
  const getStatusColor = (item: GitHubItem): "success" | "error" | "warning" | "info" | "default" => {
    if (item.pull_request) {
      if (item.pull_request.merged_at) return "success";
      return item.state === "closed" ? "error" : "info";
    }
    return item.state === "closed" ? "error" : "warning";
  };

  // Helper function to get status label
  const getStatusLabel = (item: GitHubItem): string => {
    if (item.pull_request?.merged_at) return "Merged";
    return item.state.charAt(0).toUpperCase() + item.state.slice(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh", color: theme.palette.text.primary }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          GitHub Activity Tracker
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Track and analyze your GitHub issues and pull requests
        </Typography>
      </Box>

      {/* Authentication Card */}
      <Card sx={{ mb: 4, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <KeyIcon size={20} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              GitHub Authentication
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your GitHub username"
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Personal Access Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  type="password"
                  required
                  placeholder="Paste your token here"
                  variant="outlined"
                  size="medium"
                  helperText={
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: "0.75rem",
                        mt: 0.5,
                      }}
                    >
                      <Link
                        href="https://github.com/settings/tokens/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontSize: "0.75rem",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: theme.palette.primary.main,
                        }}
                      >
                        <KeyIcon size={12} />
                        Generate token
                      </Link>
                      <Box component="span" sx={{ opacity: 0.6 }}>
                        •
                      </Box>
                      <Link
                        href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontSize: "0.75rem",
                          textDecoration: "none",
                          color: theme.palette.primary.main,
                        }}
                      >
                        Learn more
                      </Link>
                    </Box>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  Fetch Data
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {(authError || dataError) && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 1 }}>
          {authError || dataError}
        </Alert>
      )}

      {/* Filters Section */}
      <Card sx={{ mb: 4, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Filter size={20} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Search by title..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <Search size={16} style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Repository"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                placeholder="Filter by repo..."
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs + State Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => {
              setTab(v);
              setPage(0);
            }}
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
              },
            }}
          >
            <Tab
              label={`Issues (${totalIssues})`}
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            />
            <Tab
              label={`Pull Requests (${totalPrs})`}
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            />
          </Tabs>
        </Box>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel sx={{ fontSize: "14px" }}>Filter by State</InputLabel>
          <Select
            value={tab === 0 ? issueFilter : prFilter}
            onChange={(e) =>
              tab === 0
                ? setIssueFilter(e.target.value)
                : setPrFilter(e.target.value)
            }
            label="Filter by State"
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: "4px",
              "& .MuiSelect-select": { padding: "10px 14px" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <MenuItem value="all">All States</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            {tab === 1 && <MenuItem value="merged">Merged</MenuItem>}
          </Select>
        </FormControl>
      </Box>

      {/* Results Section */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ my: 6, minHeight: "300px" }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={48} />
            <Typography sx={{ mt: 2, color: theme.palette.text.secondary }}>
              Loading your data...
            </Typography>
          </Box>
        </Box>
      ) : currentFilteredData.length === 0 ? (
        <Card sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              No {tab === 0 ? "issues" : "pull requests"} found
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
              Try adjusting your filters or search criteria
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Title
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Repository
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    State
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Created
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentFilteredData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.02)",
                        transition: "background-color 0.2s",
                      },
                      borderBottom: index === currentFilteredData.length - 1 ? "none" : undefined,
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", color: theme.palette.primary.main }}>
                          {getStatusIcon(item)}
                        </Box>
                        <Link
                          href={item.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="none"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {item.title}
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }}>
                      <Chip
                        label={item.repository_url.split("/").slice(-1)[0]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }}>
                      <Chip
                        label={getStatusLabel(item)}
                        size="small"
                        color={getStatusColor(item)}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, color: theme.palette.text.secondary }}>
                      {formatDate(item.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            sx={{
              "& .MuiTablePagination-root": {
                borderTop: "none",
              },
            }}
          />
        </Card>
      )}
    </Container>
  );
};

export default Home;
