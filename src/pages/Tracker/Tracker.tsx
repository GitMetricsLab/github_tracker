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
import Dashboard from "../../components/Dashboard";
import { KeyIcon } from "lucide-react";

const ROWS_PER_PAGE = 10;
const ACTIVE_DAYS_ROWS_PER_PAGE = 8;

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
  const [activeDaysPage, setActiveDaysPage] = useState(0);
  const [hasFetchedData, setHasFetchedData] = useState(false);

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
    setHasFetchedData(true);
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
  const filteredIssues = filterData(issues, issueFilter);
  const filteredPrs = filterData(prs, prFilter);
  const currentFilteredData = tab === 0 ? filteredIssues : filteredPrs;
  const totalCount = tab === 0 ? totalIssues : totalPrs;
  const showStateFilter = tab !== 2;
  const isActiveDaysTab = tab === 2;
  const activeDaysData = Array.from(
    new Set(
      [...filteredIssues, ...filteredPrs]
        .map((item) => item.created_at?.slice(0, 10))
        .filter((date): date is string => Boolean(date))
    )
  )
    .map((date) => ({
      date,
      count: [...filteredIssues, ...filteredPrs].filter(
        (item) => item.created_at?.slice(0, 10) === date
      ).length,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
  const totalActiveDays = activeDaysData.length;
  const activeDaysPageData = activeDaysData.slice(
    activeDaysPage * ACTIVE_DAYS_ROWS_PER_PAGE,
    activeDaysPage * ACTIVE_DAYS_ROWS_PER_PAGE + ACTIVE_DAYS_ROWS_PER_PAGE
  );

  useEffect(() => {
    if (
      activeDaysPage > 0 &&
      activeDaysPage * ACTIVE_DAYS_ROWS_PER_PAGE >= activeDaysData.length
    ) {
      setActiveDaysPage(0);
    }
  }, [activeDaysData.length, activeDaysPage]);

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
      </Paper>

      {hasFetchedData && (
        <Dashboard
          totalIssues={totalIssues}
          totalPrs={totalPrs}
          data={currentFilteredData}
          theme={theme}
        />
      )}

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
            setActiveDaysPage(0);
          }}
          sx={{ flex: 1 }}
        >
          <Tab label={`Issues (${totalIssues})`} />
          <Tab label={`Pull Requests (${totalPrs})`} />
          <Tab label={`Active Days (${activeDaysData.length})`} />
        </Tabs>
        {showStateFilter && (
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
        )}
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
      ) : isActiveDaysTab ? (
        <Box>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2.5, sm: 3 },
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}18, ${theme.palette.secondary.main}10)`,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="overline" color="textSecondary" sx={{ letterSpacing: 1.2 }}>
                  Analytics Snapshot
                </Typography>
                <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 700 }}>
                  Total Active Days
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Unique calendar days with at least one issue or pull request activity.
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1,
                  color: theme.palette.primary.main,
                  textAlign: { xs: "left", sm: "right" },
                }}
              >
                {totalActiveDays}
              </Typography>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Activities</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {activeDaysPageData.length > 0 ? (
                  activeDaysPageData.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell align="center">{item.count}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No active days found for the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={activeDaysData.length}
              page={activeDaysPage}
              onPageChange={(_event, newPage) => setActiveDaysPage(newPage)}
              rowsPerPage={ACTIVE_DAYS_ROWS_PER_PAGE}
              rowsPerPageOptions={[ACTIVE_DAYS_ROWS_PER_PAGE]}
            />
          </TableContainer>
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
