import React, { useState, useEffect } from "react";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitMergeIcon,
} from "@primer/octicons-react";
import {
  Box,
  TextField,
  Button,
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
} from "@mui/material";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";

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
  const { username, setUsername, token, setToken, error: authError, getOctokit } = useGitHubAuth();
  const { issues, prs, totalIssues, totalPrs, loading, error: dataError, fetchData } = useGitHubData(getOctokit);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [issueFilter, setIssueFilter] = useState("all");
  const [prFilter, setPrFilter] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (username) fetchData(username, page + 1, ROWS_PER_PAGE);
  }, [tab, page]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(0);
    fetchData(username, 1, ROWS_PER_PAGE);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  const filterData = (data: GitHubItem[], filterType: string): GitHubItem[] => {
    let f = [...data];
    if (["open", "closed", "merged"].includes(filterType)) {
      f = f.filter((item) => {
        if (filterType === "merged") return !!item.pull_request?.merged_at;
        if (filterType === "closed") return item.state === "closed" && !item.pull_request?.merged_at;
        return item.state === "open";
      });
    }
    if (searchTitle) f = f.filter((i) => i.title.toLowerCase().includes(searchTitle.toLowerCase()));
    if (selectedRepo) f = f.filter((i) => i.repository_url.includes(selectedRepo));
    if (startDate) f = f.filter((i) => new Date(i.created_at) >= new Date(startDate));
    if (endDate) f = f.filter((i) => new Date(i.created_at) <= new Date(endDate));
    return f;
  };

  const getStatusIcon = (item: GitHubItem) => {
    if (item.pull_request) {
      if (item.pull_request.merged_at) return <GitMergeIcon size={14} className="icon-merged" />;
      if (item.state === "closed") return <GitPullRequestClosedIcon size={14} className="icon-pr-closed" />;
      return <GitPullRequestIcon size={14} className="icon-pr-open" />;
    }
    if (item.state === "closed") return <IssueClosedIcon size={14} className="icon-issue-closed" />;
    return <IssueOpenedIcon size={14} className="icon-issue-open" />;
  };

  const getStateBadge = (item: GitHubItem) => {
    const isMerged = item.pull_request?.merged_at;
    const state = isMerged ? "merged" : item.state;
    return <span className={`gt-badge gt-badge-${state}`}>{state}</span>;
  };

  const currentRawData = tab === 0 ? issues : prs;
  const currentFilter = tab === 0 ? issueFilter : prFilter;
  const currentFilteredData = filterData(currentRawData, currentFilter);
  const totalCount = tab === 0 ? totalIssues : totalPrs;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      fontFamily: "var(--font-body)",
      fontSize: "15px",
      backgroundColor: "var(--color-bg-2)",
      "& fieldset": { borderColor: "var(--color-border)" },
      "&:hover fieldset": { borderColor: "var(--color-text-3)" },
      "&.Mui-focused fieldset": { borderColor: "var(--color-primary)", borderWidth: "1px" },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "var(--font-display)",
      fontSize: "14px",
      "&.Mui-focused": { color: "var(--color-primary)" },
    },
    "& input": { color: "var(--color-text)" },
  };

  return (
    <div
      className="min-h-screen w-full transition-theme"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Page header */}
      <div
        className="transition-theme"
        style={{ borderBottom: "1px solid var(--color-border)", padding: "40px 24px 32px", backgroundColor: "var(--color-bg-2)" }}
      >
        <div className="gt-container">
          <p className="gt-label mb-3">Tracker</p>
          <h1 style={{ color: "var(--color-text)", marginBottom: "8px" }}>GitHub Activity Tracker</h1>
          <p style={{ color: "var(--color-text-2)", fontSize: "16px" }}>
            Enter a GitHub username and personal access token to explore their activity.
          </p>
        </div>
      </div>

      <div className="gt-container px-4 sm:px-6 py-8">
        {/* Auth form */}
        <div
          className="mb-8 rounded transition-theme"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
            padding: "24px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px",
              color: "var(--color-text-2)", marginBottom: "16px",
            }}
          >
            Authentication
          </p>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
              <TextField
                label="GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ flex: 1, minWidth: 160, ...inputSx }}
              />
              <TextField
                label="Personal Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                type="password"
                required
                sx={{ flex: 2, minWidth: 200, ...inputSx }}
              />
              <Button
                type="submit"
                variant="contained"
                disableElevation
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "none",
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-bg)",
                  borderRadius: "var(--radius-md)",
                  padding: "13px 24px",
                  "&:hover": { backgroundColor: "var(--color-accent-2)", boxShadow: "none" },
                }}
              >
                Fetch Data
              </Button>
            </Box>
          </form>
        </div>

        {/* Filters */}
        <div
          className="mb-6 rounded transition-theme"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px 24px",
          }}
        >
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px", color: "var(--color-text-2)", marginBottom: "14px" }}>
            Filters
          </p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Search title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              sx={{ minWidth: 180, ...inputSx }}
            />
            <TextField
              label="Repository"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              sx={{ minWidth: 160, ...inputSx }}
            />
            <TextField
              label="Start date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150, ...inputSx }}
            />
            <TextField
              label="End date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150, ...inputSx }}
            />
          </Box>
        </div>

        {/* Errors */}
        {(authError || dataError) && (
          <Alert
            severity="error"
            sx={{ mb: 3, fontFamily: "var(--font-body)", fontSize: "14px", borderRadius: "var(--radius-md)" }}
          >
            {authError || dataError}
          </Alert>
        )}

        {/* Tabs + state filter */}
        <div
          className="rounded overflow-hidden transition-theme"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Tab bar */}
          <div
            className="flex items-center justify-between flex-wrap gap-3 px-6 py-3"
            style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-2)" }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => { setTab(v); setPage(0); }}
              sx={{
                "& .MuiTab-root": { fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "none", fontSize: "14px", color: "var(--color-text-3)", minHeight: 40 },
                "& .Mui-selected": { color: "var(--color-text) !important" },
                "& .MuiTabs-indicator": { backgroundColor: "var(--color-accent)", height: "2px" },
              }}
            >
              <Tab label={`Issues (${totalIssues})`} />
              <Tab label={`Pull Requests (${totalPrs})`} />
            </Tabs>

            <FormControl sx={{ minWidth: 130 }}>
              <InputLabel sx={{ fontFamily: "var(--font-display)", fontSize: "13px" }}>State</InputLabel>
              <Select
                value={tab === 0 ? issueFilter : prFilter}
                onChange={(e) => tab === 0 ? setIssueFilter(e.target.value) : setPrFilter(e.target.value)}
                label="State"
                sx={{
                  fontFamily: "var(--font-display)", fontSize: "14px",
                  backgroundColor: "var(--color-surface)",
                  "& .MuiSelect-select": { padding: "8px 12px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-border)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-text-3)" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-primary)", borderWidth: "1px" },
                }}
              >
                <MenuItem value="all" sx={{ fontFamily: "var(--font-body)", fontSize: "14px" }}>All</MenuItem>
                <MenuItem value="open" sx={{ fontFamily: "var(--font-body)", fontSize: "14px" }}>Open</MenuItem>
                <MenuItem value="closed" sx={{ fontFamily: "var(--font-body)", fontSize: "14px" }}>Closed</MenuItem>
                {tab === 1 && <MenuItem value="merged" sx={{ fontFamily: "var(--font-body)", fontSize: "14px" }}>Merged</MenuItem>}
              </Select>
            </FormControl>
          </div>

          {/* Table */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress size={24} sx={{ color: "var(--color-primary)" }} />
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" aria-label={tab === 0 ? "Issues table" : "Pull requests table"}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1.5, px: 3 }}>Title</TableCell>
                    <TableCell align="center" sx={{ py: 1.5 }}>Repository</TableCell>
                    <TableCell align="center" sx={{ py: 1.5 }}>State</TableCell>
                    <TableCell sx={{ py: 1.5, pr: 3 }}>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentFilteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6, color: "var(--color-text-3)", fontFamily: "var(--font-body)" }}>
                        No data to display. Try fetching with a valid username and token.
                      </TableCell>
                    </TableRow>
                  ) : currentFilteredData.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:hover": { backgroundColor: "var(--color-bg-2)" },
                        transition: "background-color 150ms ease",
                      }}
                    >
                      <TableCell sx={{ px: 3, py: 1.5, maxWidth: 320 }}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item)}
                          <Link
                            href={item.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                              fontFamily: "var(--font-body)", fontSize: "14px",
                              color: "var(--color-text)",
                              "&:hover": { color: "var(--color-primary)" },
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-2)" }}>
                          {item.repository_url.split("/").slice(-1)[0]}
                        </span>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        {getStateBadge(item)}
                      </TableCell>
                      <TableCell sx={{ py: 1.5, pr: 3 }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-3)" }}>
                          {formatDate(item.created_at)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={ROWS_PER_PAGE}
                rowsPerPageOptions={[ROWS_PER_PAGE]}
                sx={{
                  fontFamily: "var(--font-display)", fontSize: "13px",
                  borderTop: "1px solid var(--color-border)",
                  color: "var(--color-text-2)",
                  "& .MuiIconButton-root": { color: "var(--color-text-2)" },
                }}
              />
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;