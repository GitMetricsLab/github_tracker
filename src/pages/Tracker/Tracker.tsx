import React, { useState, useEffect, useContext } from "react"
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitMergeIcon,
} from '@primer/octicons-react';
import {
  Box,
  TextField,
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
  Tooltip,
} from "@mui/material";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import { KeyIcon, GitBranch } from "lucide-react";
import "./Tracker.css";

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

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
};

const getLanguageFromRepo = (repoName: string): string => {
  const lowerRepo = repoName.toLowerCase();

  if (lowerRepo.includes("react") || lowerRepo.includes("js")) return "JavaScript";
  if (lowerRepo.includes("ts") || lowerRepo.includes("typescript")) return "TypeScript";
  if (lowerRepo.includes("python") || lowerRepo.includes("py")) return "Python";
  if (lowerRepo.includes("java")) return "Java";
  if (lowerRepo.includes("html")) return "HTML";
  if (lowerRepo.includes("css")) return "CSS";

  return "Unknown";
};
const Home: React.FC = () => {

  const {
    username,
    setUsername,
    token,
    setToken,
    getOctokit,
  } = useGitHubAuth();

  const {
    issues,
    prs,
    totalIssues,
    totalPrs,
    contributionScore,
    loading,
    error: dataError,
    dailyActivity,
    dailyActivityLoaded,
    fetchData,
  } = useGitHubData(getOctokit);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [submittedUsername, setSubmittedUsername] = useState("");

  const [issueFilter, setIssueFilter] = useState("all");
  const [prFilter, setPrFilter] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch data after submit, then refresh when tab or page changes.
  useEffect(() => {
    if (submittedUsername) {
      fetchData(submittedUsername, page + 1, ROWS_PER_PAGE);
    }
  }, [fetchData, page, submittedUsername, tab]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    if (page !== 0) {
      setPage(0);
    }

    if (submittedUsername !== trimmedUsername) {
      setSubmittedUsername(trimmedUsername);
      return;
    }

    if (page === 0) {
      fetchData(trimmedUsername, 1, ROWS_PER_PAGE);
    }
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
  const scoreItems = [
    {
      label: "Merged PRs",
      count: contributionScore.mergedPrs,
      points: contributionScore.mergedPrs * 5,
      weight: "+5 each",
    },
    {
      label: "Open PRs",
      count: contributionScore.openPrs,
      points: contributionScore.openPrs * 2,
      weight: "+2 each",
    },
    {
      label: "Closed PRs",
      count: contributionScore.closedPrs,
      points: contributionScore.closedPrs,
      weight: "+1 each",
    },
    {
      label: "Issues Created",
      count: contributionScore.issuesCreated,
      points: contributionScore.issuesCreated,
      weight: "+1 each",
    },
  ];

  return (
    <div className="tracker-root">
      {/* Decorative cyber grid overlay */}
      <div className="tracker-grid-overlay" aria-hidden="true" />

      <div className="tracker-inner">

        {/* ── Page Heading ── */}
        <div className="tracker-heading">
          <h1>
            GitHub Activity
            <span>Tracker</span>
          </h1>
          <p>Monitor issues &amp; pull requests for any GitHub user</p>
        </div>

        {/* ── Auth Form ── */}
        <div className="tracker-glass-card">
          <div className="tracker-section-label">
            <GitBranch size={13} />
            Authentication
          </div>
          <form onSubmit={handleSubmit}>
            <div className="tracker-input-row">
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
                    <Box component="span" sx={{ opacity: 0.6 }}>•</Box>
                    <Link
                      href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: "0.75rem", textDecoration: "none" }}
                    >
                      Learn more
                    </Link>
                  </Box>
                }
              />

              {/* Gradient-border Fetch Data button */}
              <div className="tracker-fetch-btn-wrapper">
                <Button type="submit" variant="contained">
                  Fetch Data
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Filters ── */}
        <div className="tracker-glass-card">
          <div className="tracker-section-label">Filters</div>
          <div className="tracker-filters-row">
            <TextField
              label="Search Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              sx={{ minWidth: 200, flex: 1 }}
            />
            <TextField
              label="Repository"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              sx={{ minWidth: 200, flex: 1 }}
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
          </div>
        </div>

        {/* ── Tabs + State Filter ── */}
        <div className="tracker-glass-card" style={{ paddingBottom: "0.5rem" }}>
          <div className="tracker-tabs-bar">
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
                sx={{ "& .MuiSelect-select": { padding: "10px" } }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                {tab === 1 && <MenuItem value="merged">Merged</MenuItem>}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* ── Error Alert ── */}
        {dataError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "0.75rem" }}>
            {dataError}
          </Alert>
        )}

        {/* ── Results Table ── */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        ) : (
          <div className="tracker-glass-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="tracker-table-wrapper">
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
                    {currentFilteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ border: "none !important" }}>
                          <div className="tracker-empty-state">
                            <GitBranch size={40} />
                            <p>
                              {username
                                ? "No results found. Try adjusting your filters."
                                : "Enter a GitHub username above and click Fetch Data to get started."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentFilteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {getStatusIcon(item)}
                            <Link
                              href={item.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
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
                      ))
                    )}
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
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
