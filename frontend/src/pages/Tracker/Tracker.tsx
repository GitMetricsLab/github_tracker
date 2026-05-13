import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitMergeIcon,
} from "@primer/octicons-react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import type { GitHubItem } from "../../hooks/useGitHubData";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ROWS_PER_PAGE = 10;
const LOOKUP_HISTORY_KEY = "github-tracker-lookup-history";
const stateOptions = ["all", "open", "closed", "merged"] as const;

interface LookupHistoryItem {
  username: string;
  searchedAt: string;
}

const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));

const getRepositoryName = (repositoryUrl: string): string =>
  repositoryUrl.split("/").slice(-1)[0] || "repository";

const getItemStatus = (item: GitHubItem): string => {
  if (item.pull_request?.merged_at) return "merged";
  return item.state;
};

const getStatusIcon = (item: GitHubItem) => {
  if (item.pull_request) {
    if (item.pull_request.merged_at) {
      return <GitMergeIcon size={18} className="icon-merged" />;
    }

    if (item.state === "closed") {
      return <GitPullRequestClosedIcon size={18} className="icon-pr-closed" />;
    }

    return <GitPullRequestIcon size={18} className="icon-pr-open" />;
  }

  if (item.state === "closed") {
    return <IssueClosedIcon size={18} className="icon-issue-closed" />;
  }

  return <IssueOpenedIcon size={18} className="icon-issue-open" />;
};

const getLookupHistory = (): LookupHistoryItem[] => {
  try {
    const savedHistory = localStorage.getItem(LOOKUP_HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch {
    return [];
  }
};

const loadTrackerHistoryFromBackend = async (): Promise<
  LookupHistoryItem[]
> => {
  try {
    const response = await axios.get(`${backendUrl}/api/auth/tracker-history`, {
      withCredentials: true,
    });
    return response.data.trackerHistory || [];
  } catch (err) {
    console.log(
      "Could not load tracker history from backend, using localStorage",
    );
    return getLookupHistory();
  }
};

const saveTrackerHistoryToBackend = async (
  username: string,
  searchedAt: string,
) => {
  try {
    await axios.post(
      `${backendUrl}/api/auth/tracker-history`,
      { username, searchedAt },
      { withCredentials: true },
    );
  } catch (err) {
    console.log("Could not save tracker history to backend");
  }
};

const Tracker: React.FC = () => {
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
  const [lookupHistory, setLookupHistory] = useState<LookupHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await loadTrackerHistoryFromBackend();
      setLookupHistory(history);
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (username) {
      fetchData(username, page + 1, ROWS_PER_PAGE);
    }
  }, [fetchData, page, tab, username]);

  const activeFilter = tab === 0 ? issueFilter : prFilter;
  const currentRawData = tab === 0 ? issues : prs;

  const repositories = useMemo(
    () =>
      Array.from(
        new Set(
          [...issues, ...prs].map((item) =>
            getRepositoryName(item.repository_url),
          ),
        ),
      ).sort(),
    [issues, prs],
  );

  const filteredData = useMemo(() => {
    return currentRawData.filter((item) => {
      const status = getItemStatus(item);
      const matchesState = activeFilter === "all" || status === activeFilter;
      const matchesTitle = item.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase().trim());
      const matchesRepo =
        !selectedRepo ||
        getRepositoryName(item.repository_url) === selectedRepo;
      const createdAt = new Date(item.created_at);
      const matchesStart = !startDate || createdAt >= new Date(startDate);
      const matchesEnd = !endDate || createdAt <= new Date(endDate);

      return (
        matchesState &&
        matchesTitle &&
        matchesRepo &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [
    activeFilter,
    currentRawData,
    endDate,
    searchTitle,
    selectedRepo,
    startDate,
  ]);

  const summary = useMemo(() => {
    const allItems = [...issues, ...prs];
    const openItems = allItems.filter(
      (item) => getItemStatus(item) === "open",
    ).length;
    const closedItems = allItems.filter(
      (item) => getItemStatus(item) === "closed",
    ).length;
    const mergedItems = allItems.filter(
      (item) => getItemStatus(item) === "merged",
    ).length;
    const completedItems = closedItems + mergedItems;

    return [
      {
        label: "Issues",
        value: totalIssues,
        helper: "Total found",
        color: "#0969da",
      },
      {
        label: "Pull requests",
        value: totalPrs,
        helper: "Total found",
        color: "#8250df",
      },
      {
        label: "Open",
        value: openItems,
        helper: "On this page",
        color: "#2ea44f",
      },
      {
        label: "Completed",
        value: completedItems,
        helper: "On this page",
        color: "#cf222e",
      },
    ];
  }, [issues, prs, totalIssues, totalPrs]);

  const clearFilters = () => {
    setSearchTitle("");
    setSelectedRepo("");
    setStartDate("");
    setEndDate("");
    setIssueFilter("all");
    setPrFilter("all");
  };

  const saveLookupHistory = async (nextUsername: string) => {
    const normalizedUsername = nextUsername.trim();

    if (!normalizedUsername) return;

    const searchedAt = new Date().toISOString();
    const nextHistory = [
      { username: normalizedUsername, searchedAt },
      ...lookupHistory.filter(
        (item) =>
          item.username.toLowerCase() !== normalizedUsername.toLowerCase(),
      ),
    ].slice(0, 5);

    setLookupHistory(nextHistory);
    localStorage.setItem(LOOKUP_HISTORY_KEY, JSON.stringify(nextHistory));

    // Save to backend
    await saveTrackerHistoryToBackend(normalizedUsername, searchedAt);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setPage(0);
    await saveLookupHistory(username);
    await fetchData(username, 1, ROWS_PER_PAGE);
  };

  const handleHistorySelect = async (historyUsername: string) => {
    setUsername(historyUsername);
    setPage(0);

    if (token) {
      await saveLookupHistory(historyUsername);
      await fetchData(historyUsername, 1, ROWS_PER_PAGE);
    }
  };

  const hasData = issues.length > 0 || prs.length > 0;
  const totalCount = tab === 0 ? totalIssues : totalPrs;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #111827 0%, #0f172a 100%)"
            : "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
      }}
    >
      <Box sx={{ width: "100%", py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems="center"
            >
              <Box sx={{ flex: 1 }}>
                <Chip
                  label="Interactive dashboard"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2, fontWeight: 700 }}
                />
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{ letterSpacing: 0 }}
                >
                  Track GitHub activity without the clutter
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1.5, maxWidth: 760 }}
                >
                  Search a profile, filter by state or repository, and scan
                  issues and pull requests in one focused workspace.
                </Typography>
              </Box>

              <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={0}
                sx={{
                  width: { xs: "100%", md: 460 },
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label="GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Personal access token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    type="password"
                    required
                    fullWidth
                    helperText="Used only in your browser session for GitHub API requests."
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ borderRadius: 2, py: 1.25, fontWeight: 800 }}
                  >
                    {loading ? "Fetching activity..." : "Fetch activity"}
                  </Button>

                  {lookupHistory.length > 0 && (
                    <Box>
                      <Typography
                        color="text.secondary"
                        fontSize={13}
                        fontWeight={700}
                        sx={{ mb: 1 }}
                      >
                        Recent username history
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {lookupHistory.map((item) => (
                          <Chip
                            key={`${item.username}-${item.searchedAt}`}
                            label={`${item.username} · ${formatDate(item.searchedAt)}`}
                            clickable
                            variant="outlined"
                            onClick={() => handleHistorySelect(item.username)}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Paper>

          {(authError || dataError) && (
            <Alert severity="error">{authError || dataError}</Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {summary.map((item) => (
              <Paper
                key={item.label}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      fontWeight={700}
                      fontSize={13}
                    >
                      {item.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={900}>
                      {item.value}
                    </Typography>
                    <Typography color="text.secondary" fontSize={13}>
                      {item.helper}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 12,
                      height: 52,
                      borderRadius: 999,
                      backgroundColor: item.color,
                    }}
                  />
                </Stack>
              </Paper>
            ))}
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", md: "center" }}
                  spacing={2}
                >
                  <Tabs
                    value={tab}
                    onChange={(_, value) => {
                      setTab(value);
                      setPage(0);
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label={`Issues (${totalIssues})`} />
                    <Tab label={`Pull requests (${totalPrs})`} />
                  </Tabs>

                  <Button
                    onClick={clearFilters}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Clear filters
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {stateOptions
                    .filter((option) => tab === 1 || option !== "merged")
                    .map((option) => (
                      <Chip
                        key={option}
                        label={option[0].toUpperCase() + option.slice(1)}
                        clickable
                        color={activeFilter === option ? "primary" : "default"}
                        variant={
                          activeFilter === option ? "filled" : "outlined"
                        }
                        onClick={() =>
                          tab === 0
                            ? setIssueFilter(option)
                            : setPrFilter(option)
                        }
                      />
                    ))}
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "2fr 1fr 1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Search title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Repository</InputLabel>
                    <Select
                      value={selectedRepo}
                      label="Repository"
                      onChange={(e) => setSelectedRepo(e.target.value)}
                    >
                      <MenuItem value="">All repositories</MenuItem>
                      {repositories.map((repo) => (
                        <MenuItem key={repo} value={repo}>
                          {repo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Start date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="End date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Box>
              </Stack>
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {loading ? (
                <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
                  <CircularProgress />
                  <Typography color="text.secondary">
                    Loading GitHub activity...
                  </Typography>
                </Stack>
              ) : !hasData ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 3,
                    border: `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h5" fontWeight={800}>
                    Ready when you are
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Enter a username and token to build an activity dashboard.
                  </Typography>
                </Paper>
              ) : filteredData.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 3,
                    border: `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h5" fontWeight={800}>
                    No matches found
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Try clearing filters or changing the search text.
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={1.5}>
                  {filteredData.map((item) => (
                    <Paper
                      key={item.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        transition:
                          "transform 160ms ease, box-shadow 160ms ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                        >
                          <Box sx={{ mt: 0.5 }}>{getStatusIcon(item)}</Box>
                          <Box>
                            <Link
                              href={item.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 800,
                                fontSize: 16,
                              }}
                            >
                              {item.title}
                            </Link>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              useFlexGap
                              sx={{ mt: 1 }}
                            >
                              <Chip
                                size="small"
                                label={getRepositoryName(item.repository_url)}
                              />
                              <Chip
                                size="small"
                                label={getItemStatus(item)}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label={formatDate(item.created_at)}
                                variant="outlined"
                              />
                            </Stack>
                          </Box>
                        </Stack>

                        <Button
                          href={item.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
                        >
                          View on GitHub
                        </Button>
                      </Stack>
                    </Paper>
                  ))}

                  <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={ROWS_PER_PAGE}
                    rowsPerPageOptions={[ROWS_PER_PAGE]}
                  />
                </Stack>
              )}
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default Tracker;
