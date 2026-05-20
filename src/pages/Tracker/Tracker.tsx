import React, { useState, useEffect } from "react";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitMergeIcon,
  KeyIcon,
  MarkGithubIcon,
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
  Alert,
  Skeleton,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  Tooltip,
  Fade,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import { useDebounce } from "../../hooks/useDebounce";
import {
  Visibility,
  VisibilityOff,
  FilterList,
  ClearAll,
} from "@mui/icons-material";

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
  const [showToken, setShowToken] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

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

  // Debounce search and repo inputs to avoid rapid API calls
  const debouncedSearch = useDebounce(searchTitle, 500);
  const debouncedRepo = useDebounce(selectedRepo, 500);

  // Fetch data when username, tab, page, or filters change
  useEffect(() => {
    if (username) {
      const type = tab === 0 ? "issue" : "pr";
      const filters = {
        search: debouncedSearch,
        repo: debouncedRepo,
        startDate: startDate,
        endDate: endDate,
        state: tab === 0 ? issueFilter : prFilter,
      };
      fetchData(username, page + 1, ROWS_PER_PAGE, type, filters);
    }
  }, [username, tab, page, issueFilter, prFilter, debouncedSearch, debouncedRepo, startDate, endDate, fetchData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (page === 0) {
      const type = tab === 0 ? "issue" : "pr";
      const filters = {
        search: debouncedSearch,
        repo: debouncedRepo,
        startDate: startDate,
        endDate: endDate,
        state: tab === 0 ? issueFilter : prFilter,
      };
      fetchData(username, 1, ROWS_PER_PAGE, type, filters);
    } else {
      setPage(0);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setSearchTitle("");
    setSelectedRepo("");
    setStartDate("");
    setEndDate("");
    setIssueFilter("all");
    setPrFilter("all");
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filterData = (data: GitHubItem[], filterType: string): GitHubItem[] => {
    let filtered = [...data];
    if (["open", "closed", "merged"].includes(filterType)) {
      filtered = filtered.filter((item) => {
        if (filterType === "merged") {
          return !!item.pull_request?.merged_at;
        } else if (filterType === "closed") {
          return item.state === "closed" && !item.pull_request?.merged_at;
        } else {
          return item.state === "open";
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
        item.repository_url.toLowerCase().includes(selectedRepo.toLowerCase())
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
      if (item.state === "closed")
        return <GitPullRequestClosedIcon size={16} className="icon-pr-closed" />;
      return <GitPullRequestIcon size={16} className="icon-pr-open" />;
    }
    if (item.state === "closed")
      return <IssueClosedIcon size={16} className="icon-issue-closed" />;
    return <IssueOpenedIcon size={16} className="icon-issue-open" />;
  };

  const getStatusChip = (item: GitHubItem) => {
    let status = item.pull_request?.merged_at ? "merged" : item.state;
    let color: "success" | "error" | "warning" | "default" = "default";

    if (status === "open") {
      color = "success";
      status = "Open";
    } else if (status === "closed") {
      color = "error";
      status = "Closed";
    } else if (status === "merged") {
      color = "warning";
      status = "Merged";
    }

    return <Chip label={status} size="small" color={color} variant="outlined" />;
  };

  // Current data and filtered data according to tab and filters
  const currentRawData = tab === 0 ? issues : prs;
  const currentFilteredData = filterData(
    currentRawData,
    tab === 0 ? issueFilter : prFilter
  );
  const totalCount = tab === 0 ? totalIssues : totalPrs;

  const hasActiveFilters =
    searchTitle || selectedRepo || startDate || endDate || issueFilter !== "all" || prFilter !== "all";

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: "80vh" }}>
      {/* Header */}
      {/* <Box sx={{ mb: 4, textAlign: "center" }}>
        <MarkGithubIcon size={48} />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          GitHub Activity Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track issues and pull requests across GitHub repositories
        </Typography>
      </Box> */}

      {/* Auth Form */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                variant="outlined"
                placeholder="e.g., octocat"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MarkGithubIcon size={16} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Personal Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                type={showToken ? "text" : "password"}
                fullWidth
                variant="outlined"
                placeholder="ghp_xxxxxxxxxxxx"
                helperText={
                  <span>
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
                    {" • "}
                    <Link
                      href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: "0.75rem", textDecoration: "none" }}
                    >
                      Learn more
                    </Link>
                  </span>
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon size={16} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowToken(!showToken)}
                        edge="end"
                        size="small"
                      >
                        {showToken ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  minWidth: "140px",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 3,
                }}
              >
                {loading ? "Loading..." : "Fetch Data"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Filter Header with Toggle */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterList fontSize="small" color="action" />
          <Typography variant="subtitle2" color="text.secondary">
            Filters
          </Typography>
          <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {showFilters ? "Hide" : "Show"}
            </Typography>
          </IconButton>
        </Box>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearAll />}
            onClick={clearFilters}
            sx={{ textTransform: "none" }}
          >
            Clear all filters
          </Button>
        )}
      </Box>

      {/* Filters Section */}
      <Fade in={showFilters}>
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.default,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              useFlexGap
            >
              <TextField
                label="Search Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                size="small"
                placeholder="Filter by title..."
                sx={{ minWidth: 180, flex: 2 }}
              />
              <TextField
                label="Repository"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                size="small"
                placeholder="Filter by repo name..."
                sx={{ minWidth: 160, flex: 2 }}
              />
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ minWidth: 140 }}
              />
            </Stack>
          </Paper>
        </Box>
      </Fade>

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
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IssueOpenedIcon size={14} />
                Issues
                <Chip
                  label={totalIssues}
                  size="small"
                  color={tab === 0 ? "primary" : "default"}
                  sx={{ ml: 0.5, height: 20, "& .MuiChip-label": { px: 1, fontSize: "0.7rem" } }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GitPullRequestIcon size={14} />
                Pull Requests
                <Chip
                  label={totalPrs}
                  size="small"
                  color={tab === 1 ? "primary" : "default"}
                  sx={{ ml: 0.5, height: 20, "& .MuiChip-label": { px: 1, fontSize: "0.7rem" } }}
                />
              </Box>
            }
          />
        </Tabs>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>State Filter</InputLabel>
          <Select
            value={tab === 0 ? issueFilter : prFilter}
            onChange={(e) =>
              tab === 0
                ? setIssueFilter(e.target.value)
                : setPrFilter(e.target.value)
            }
            label="State Filter"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            {tab === 1 && <MenuItem value="merged">Merged</MenuItem>}
          </Select>
        </FormControl>
      </Box>

      {/* Error Alerts */}
      {(authError || dataError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {authError || dataError}
        </Alert>
      )}

      {/* Content Area */}
      {loading ? (
        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Repository
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="85%" height={30} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width="60%" height={30} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={70} height={28} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="70%" height={30} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : !authError && !dataError && currentFilteredData.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Typography variant="h6" gutterBottom color="text.secondary">
            No Data Found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {hasActiveFilters
              ? "Try adjusting your filters to see more results."
              : "Enter a GitHub username and fetch data to get started."}
          </Typography>
        </Card>
      ) : (
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
            <TableContainer>
              <Table size="medium" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Repository
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentFilteredData.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:hover": {
                          bgcolor: theme.palette.action.hover,
                        },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          {getStatusIcon(item)}
                          <Link
                            href={item.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                              color: theme.palette.text.primary,
                              fontWeight: 500,
                              textDecoration: "none",
                              "&:hover": {
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            {item.title}
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.repository_url.split("/").slice(-1)[0]}
                          size="small"
                          variant="outlined"
                          sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                        />
                      </TableCell>
                      <TableCell align="center">{getStatusChip(item)}</TableCell>
                      <TableCell>
                        <Tooltip title={new Date(item.created_at).toLocaleString()}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(item.created_at)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Divider />
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          />
        </Card>
      )}
    </Container>
  );
};

export default Tracker;
