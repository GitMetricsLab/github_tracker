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
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import { KeyIcon } from "lucide-react";

const ROWS_PER_PAGE = 10;
const RECENT_SEARCHES_KEY = 'githubTrackerRecentSearches';
const MAX_RECENT_SEARCHES = 10;

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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [issueFilter, setIssueFilter] = useState("all");
  const [prFilter, setPrFilter] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const normalizeSearchUsername = (value: string): string => value.trim();

  const loadRecentSearches = (): string[] => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, MAX_RECENT_SEARCHES);
    } catch {
      return [];
    }
  };

  const persistRecentSearches = (searches: string[]) => {
    setRecentSearches(searches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  };

  const addRecentSearch = (value: string) => {
    const normalized = normalizeSearchUsername(value);
    if (!normalized) {
      return;
    }

    const updated = [
      normalized,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== normalized.toLowerCase()
      ),
    ].slice(0, MAX_RECENT_SEARCHES);

    persistRecentSearches(updated);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  // Fetch data when tab or page changes.
  // Do not fetch on intermediate username typing.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (username) {
      fetchData(username, page + 1, ROWS_PER_PAGE);
    }
  }, [tab, page]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const normalizedUsername = normalizeSearchUsername(username);
    if (!normalizedUsername) {
      return;
    }

    setUsername(normalizedUsername);
    setPage(0);

    const wasSuccessful = await fetchData(
      normalizedUsername,
      1,
      ROWS_PER_PAGE
    );

    if (wasSuccessful) {
      addRecentSearch(normalizedUsername);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRecentSearchClick = async (value: string) => {
    const normalizedUsername = normalizeSearchUsername(value);
    if (!normalizedUsername) {
      return;
    }

    setUsername(normalizedUsername);
    setPage(0);

    const wasSuccessful = await fetchData(
      normalizedUsername,
      1,
      ROWS_PER_PAGE
    );

    if (wasSuccessful) {
      addRecentSearch(normalizedUsername);
    }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, minHeight: "80vh", color: theme.palette.text.primary }}>
      {/* Auth Form */}
      <Paper elevation={1} sx={{ p: 2, mb: 4, backgroundColor: theme.palette.background.paper }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ flex: 1, minWidth: 150 }}
            />
            <TextField
              label="Personal Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              required
              sx={{ flex: 1, minWidth: 150 }}
              helperText={
                <Box
                    component="span"
                    sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.75rem",
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
                    }}
                    >
                    <KeyIcon size={12} />
                    Generate new token
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
                    }}
                    >
                    Learn more
                    </Link>
                </Box>
              }
            />
            <Button
                type="submit"
                variant="contained"
                sx={{
                    minWidth: "100px",
                    minHeight: "55px",
                    alignSelf: "flex-start",
            }}
            >
                Fetch Data
            </Button>
          </Box>
        </form>

        {recentSearches.length > 0 && (
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
                Recent searches
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={clearRecentSearches}
              >
                Clear History
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recentSearches.map((item) => (
                <Button
                  key={item}
                  variant="outlined"
                  size="small"
                  onClick={() => handleRecentSearchClick(item)}
                  sx={{ textTransform: 'none' }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Filters */}
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Search Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Repository"
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
      </Box>

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
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setPage(0);
          }}
          sx={{ flex: 1 }}
        >
          <Tab label={`Issues (${totalIssues})`} />
          <Tab label={`Pull Requests (${totalPrs})`} />
        </Tabs>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: "14px" }}>State</InputLabel>
          <Select
            value={tab === 0 ? issueFilter : prFilter}
            onChange={(e) =>
              tab === 0
                ? setIssueFilter(e.target.value)
                : setPrFilter(e.target.value)
            }
            label="State"
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: "4px",
              "& .MuiSelect-select": { padding: "10px" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            {tab === 1 && <MenuItem value="merged">Merged</MenuItem>}
          </Select>
        </FormControl>
      </Box>

      {(authError || dataError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {authError || dataError}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>

          <TableContainer component={Paper}>

            <Table size="small">

              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="center">Repository</TableCell>
                  <TableCell align="center">State</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {currentFilteredData.map((item) => (
                  <TableRow key={item.id}>

                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(item)}
                        <Link
                            href={item.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ color: theme.palette.primary.main }}
                        >
                            {item.title}
                        </Link>
                    </TableCell>


                    <TableCell align="center">
                      {item.repository_url.split("/").slice(-1)[0]}
                    </TableCell>

                    <TableCell align="center">
                      {item.pull_request?.merged_at ? "merged" : item.state}
                    </TableCell>

                    <TableCell>{formatDate(item.created_at)}</TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>

            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={ROWS_PER_PAGE}
              rowsPerPageOptions={[ROWS_PER_PAGE]}
            />

          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default Home;
