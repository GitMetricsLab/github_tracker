import React, { useState, useEffect, useMemo } from "react"
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
  Chip,
  Divider,
  InputAdornment,
  Tooltip,
  IconButton,
  Skeleton,
  Stack,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import GitHubIcon from "@mui/icons-material/GitHub";
import CallMadeIcon from "@mui/icons-material/CallMade";
import { useTheme } from "@mui/material/styles";
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

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: number;
  color: string;
  bg: string;
}> = ({ label, value, color, bg }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 100,
      px: 2,
      py: 1.5,
      borderRadius: "10px",
      backgroundColor: bg,
      display: "flex",
      flexDirection: "column",
      gap: 0.3,
    }}
  >
    <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color, lineHeight: 1.2 }}>
      {value}
    </Typography>
  </Box>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Home: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (username) fetchData(username, page + 1, ROWS_PER_PAGE);
  }, [tab, page]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setPage(0);
    setHasFetched(true);
    fetchData(username, 1, ROWS_PER_PAGE);
  };

  const handleClearFilters = () => {
    setSearchTitle("");
    setSelectedRepo("");
    setStartDate("");
    setEndDate("");
    setIssueFilter("all");
    setPrFilter("all");
  };

  const hasActiveFilters =
    !!searchTitle || !!selectedRepo || !!startDate || !!endDate ||
    issueFilter !== "all" || prFilter !== "all";

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });

  const filterData = (data: GitHubItem[], filterType: string): GitHubItem[] => {
    let filtered = [...data];
    if (["open", "closed", "merged"].includes(filterType)) {
      filtered = filtered.filter((item) => {
        if (filterType === "merged") return !!item.pull_request?.merged_at;
        if (filterType === "closed") return item.state === "closed" && !item.pull_request?.merged_at;
        return item.state === "open";
      });
    }
    if (searchTitle) filtered = filtered.filter((i) => i.title.toLowerCase().includes(searchTitle.toLowerCase()));
    if (selectedRepo) filtered = filtered.filter((i) => i.repository_url.includes(selectedRepo));
    if (startDate) filtered = filtered.filter((i) => i.created_at.slice(0, 10) >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.created_at.slice(0, 10) <= endDate);
    return filtered;
  };

  const currentRawData = tab === 0 ? issues : prs;

  const stats = useMemo(() => {
    const open = currentRawData.filter((i) => i.state === "open").length;
    const merged = currentRawData.filter((i) => !!i.pull_request?.merged_at).length;
    const closed = currentRawData.filter((i) => i.state === "closed" && !i.pull_request?.merged_at).length;
    return { open, merged, closed };
  }, [currentRawData]);

  const currentFilteredData = filterData(currentRawData, tab === 0 ? issueFilter : prFilter);
  const totalCount = tab === 0 ? totalIssues : totalPrs;
  const visibleStats = useMemo(() => {
    const open = currentFilteredData.filter((i) => i.state === "open").length;
    const merged = currentFilteredData.filter((i) => !!i.pull_request?.merged_at).length;
    const closed = currentFilteredData.filter((i) => i.state === "closed" && !i.pull_request?.merged_at).length;
    return { open, merged, closed };
  }, [currentFilteredData]);

  const activeFilterSummary = useMemo(() => {
    const labels: string[] = [];
    if (tab === 0 ? issueFilter !== "all" : prFilter !== "all") labels.push("state");
    if (searchTitle) labels.push("title");
    if (selectedRepo) labels.push("repo");
    if (startDate || endDate) labels.push("date");
    return labels;
  }, [tab, issueFilter, prFilter, searchTitle, selectedRepo, startDate, endDate]);

  const activeFilterCount = activeFilterSummary.length;
  const visibleShare = totalCount ? Math.round((currentFilteredData.length / totalCount) * 100) : 0;
  const progressValue = Math.max(8, visibleShare || 0);

  const getStatusIcon = (item: GitHubItem) => {
    if (item.pull_request) {
      if (item.pull_request.merged_at) return <GitMergeIcon size={15} className="icon-merged" />;
      if (item.state === "closed") return <GitPullRequestClosedIcon size={15} className="icon-pr-closed" />;
      return <GitPullRequestIcon size={15} className="icon-pr-open" />;
    }
    if (item.state === "closed") return <IssueClosedIcon size={15} className="icon-issue-closed" />;
    return <IssueOpenedIcon size={15} className="icon-issue-open" />;
  };

  const getStateChip = (item: GitHubItem) => {
    const isMerged = !!item.pull_request?.merged_at;
    const state = isMerged ? "merged" : item.state;
    const styles: Record<string, { bg: string; color: string }> = {
      open:   { bg: isDark ? "#1a3a1a" : "#dafbe1", color: isDark ? "#56d364" : "#1a7f37" },
      closed: { bg: isDark ? "#3a1a1a" : "#fff0f0", color: isDark ? "#f85149" : "#cf222e" },
      merged: { bg: isDark ? "#2a1a4a" : "#ede9fe", color: isDark ? "#a371f7" : "#6e40c9" },
    };
    const s = styles[state] ?? styles["closed"];
    return (
      <Chip
        label={state}
        size="small"
        sx={{
          backgroundColor: s.bg,
          color: s.color,
          fontWeight: 600,
          fontSize: "0.68rem",
          height: "20px",
          textTransform: "capitalize",
          border: "none",
          borderRadius: "6px",
        }}
      />
    );
  };

  const cellSx = {
    fontSize: "0.82rem",
    py: 1.3,
    borderBottom: `1px solid ${theme.palette.divider}`,
  };

  const surfaceGradient = isDark
    ? "radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 35%), linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.72))"
    : "radial-gradient(circle at top right, rgba(37,99,235,0.14), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))";

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8, minHeight: "80vh" }}>

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 2.5, md: 3.25 },
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "18px",
          background: surfaceGradient,
          boxShadow: isDark ? "0 18px 50px rgba(0,0,0,0.28)" : "0 18px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "auto -50px -70px auto",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.10)",
            filter: "blur(8px)",
          }}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box sx={{ maxWidth: 720 }}>
            <Chip
              label="Live GitHub tracker"
              size="small"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                borderRadius: "999px",
                backgroundColor: isDark ? "rgba(59,130,246,0.16)" : "rgba(37,99,235,0.10)",
                color: theme.palette.primary.main,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.03em", mb: 1 }}>
              GitHub Activity Tracker
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 620, lineHeight: 1.7 }}>
              Review your issues and pull requests in one place with quick filters, clean status badges,
              and a layout that stays readable in both light and dark themes.
            </Typography>
          </Box>

          <Box
            sx={{
              minWidth: { xs: "100%", md: 320 },
              width: { xs: "100%", md: 360 },
              p: 2,
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: isDark ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.82)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Typography sx={{ mb: 1.25, fontSize: "0.75rem", fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Overview
            </Typography>
            <Stack spacing={1.4}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.86rem", color: "text.secondary" }}>Loaded items</Typography>
                <Typography sx={{ fontWeight: 800 }}>{currentRawData.length}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.86rem", color: "text.secondary" }}>Visible after filters</Typography>
                <Typography sx={{ fontWeight: 800 }}>{currentFilteredData.length}</Typography>
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0.8 }}>
                  <Typography sx={{ fontSize: "0.86rem", color: "text.secondary" }}>Visibility</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{visibleShare}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.10)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #3b82f6, #22c55e)",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* ── Page header ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <GitHubIcon sx={{ fontSize: 26, color: "text.primary" }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.02rem",
            letterSpacing: "-0.01em",
            color: isDark ? "rgba(255,255,255,0.96)" : "text.primary",
            textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.35)" : "none",
          }}
        >
          Activity dashboard
        </Typography>
      </Box>

      {/* ── Auth card ── */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          sx={{ mb: 0.5, fontSize: "0.7rem", fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          Authentication
        </Typography>
        <Typography sx={{ mb: 1.5, fontSize: "0.86rem", color: "text.secondary" }}>
          Enter a GitHub username and personal access token to load activity securely.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              label="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              size="small"
              sx={{ flex: 1, minWidth: 150, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <TextField
              label="Personal Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              required
              size="small"
              sx={{ flex: 2, minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              InputProps={{
                endAdornment: token ? (
                  <InputAdornment position="end">
                    <Tooltip title="Clear token">
                      <IconButton size="small" onClick={() => setToken("")} edge="end">
                        <ClearIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : null,
              }}
              helperText={
                <Link
                  href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.75rem",
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  How to generate?
                </Link>
              }
            />
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
              sx={{
                height: "40px",
                minWidth: "130px",
                fontWeight: 700,
                fontSize: "0.82rem",
                textTransform: "none",
                borderRadius: "12px",
                letterSpacing: "0.02em",
                px: 2,
              }}
            >
              {loading ? "Fetching…" : "Fetch Data"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* ── Error alert ── */}
      {(authError || dataError) && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
          {authError || dataError}
        </Alert>
      )}

      {/* ── Stats row ── */}
      {hasFetched && !loading && (
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
          <StatCard label="Open"   value={stats.open}   color={isDark ? "#56d364" : "#1a7f37"} bg={isDark ? "#1a3a1a" : "#dafbe1"} />
          <StatCard label="Closed" value={stats.closed} color={isDark ? "#f85149" : "#cf222e"} bg={isDark ? "#3a1a1a" : "#fff0f0"} />
          {tab === 1 && (
            <StatCard label="Merged" value={stats.merged} color={isDark ? "#a371f7" : "#6e40c9"} bg={isDark ? "#2a1a4a" : "#ede9fe"} />
          )}
          <StatCard
            label={tab === 0 ? "Total Issues" : "Total PRs"}
            value={totalCount}
            color={theme.palette.text.secondary as string}
            bg={theme.palette.action.hover}
          />
        </Box>
      )}

      {/* ── Main card ── */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Tabs + state filter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 0.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setPage(0); }}
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: "46px" },
              "& .MuiTabs-indicator": { height: "2px", borderRadius: "2px 2px 0 0" },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  Issues
                  <Chip label={totalIssues} size="small" sx={{ height: "18px", fontSize: "0.65rem", fontWeight: 700, borderRadius: "6px" }} />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  Pull Requests
                  <Chip label={totalPrs} size="small" sx={{ height: "18px", fontSize: "0.65rem", fontWeight: 700, borderRadius: "6px" }} />
                </Box>
              }
            />
          </Tabs>

          <FormControl size="small" sx={{ minWidth: 120, my: 0.5 }}>
            <InputLabel sx={{ fontSize: "0.82rem" }}>State</InputLabel>
            <Select
              value={tab === 0 ? issueFilter : prFilter}
              onChange={(e) => tab === 0 ? setIssueFilter(e.target.value) : setPrFilter(e.target.value)}
              label="State"
              sx={{ fontSize: "0.82rem", borderRadius: "8px" }}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              {tab === 1 && <MenuItem value="merged">Merged</MenuItem>}
            </Select>
          </FormControl>
        </Box>

        {/* Filter bar */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: "flex",
            gap: 1.2,
            flexWrap: "wrap",
            alignItems: "center",
            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f6f8fa",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            placeholder="Search title…"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            size="small"
            sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "0.82rem" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Filter by repo…"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            size="small"
            sx={{ minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "0.82rem" } }}
          />
          <TextField
            label="From"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "0.82rem" } }}
          />
          <TextField
            label="To"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "0.82rem" } }}
          />
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <Button
                size="small"
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontSize: "0.75rem", textTransform: "none",
                  borderRadius: "12px", height: "36px",
                  color: "text.secondary", borderColor: "divider",
                }}
              >
                Clear
              </Button>
            </Tooltip>
          )}
          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled", ml: "auto" }}>
            {currentFilteredData.length} of {currentRawData.length} shown
            {activeFilterCount > 0 ? ` • ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active` : ""}
          </Typography>
        </Box>

        {/* Content area */}
        {loading ? (
          <Box sx={{ p: 2 }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={44} sx={{ mb: 0.5, borderRadius: "6px" }} animation="wave" />
            ))}
          </Box>
        ) : !hasFetched ? (
          <Box py={9} textAlign="center">
            <GitHubIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              No data yet
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ fontSize: "0.78rem", maxWidth: 420, mx: "auto", lineHeight: 1.7 }}>
              Enter your credentials above and click Fetch Data to load a cleaner, more interactive view of your GitHub activity.
            </Typography>
          </Box>
        ) : currentFilteredData.length === 0 ? (
          <Box py={8} textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              No results match your filters.
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ fontSize: "0.78rem", mb: 1.5 }}>
              Try widening the date range, switching the state filter, or searching a shorter title.
            </Typography>
            {hasActiveFilters && (
              <Button size="small" onClick={handleClearFilters} sx={{ textTransform: "none", fontSize: "0.8rem" }}>
                Clear filters
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    { label: "Title", align: "left" as const },
                    { label: "Repository", align: "center" as const },
                    { label: "State", align: "center" as const },
                    { label: "Created", align: "left" as const },
                  ].map(({ label, align }) => (
                    <TableCell
                      key={label}
                      align={align}
                      sx={{
                        ...cellSx,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        color: "text.disabled",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f6f8fa",
                        py: 1,
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentFilteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      transition: "background-color 0.15s ease, transform 0.15s ease",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: isDark ? "rgba(59,130,246,0.06)" : "rgba(37,99,235,0.04)",
                      },
                    }}
                    onClick={() => window.open(item.html_url, "_blank", "noopener,noreferrer")}
                  >
                    {/* Title */}
                    <TableCell sx={{ ...cellSx, maxWidth: 420 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: "text.secondary" }}>
                          {getStatusIcon(item)}
                        </Box>
                        <Link
                          href={item.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="none"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            fontSize: "0.83rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                            maxWidth: 380,
                            "&:hover": { color: "primary.main" },
                            "&:hover .ext-icon": { opacity: 1 },
                          }}
                        >
                          {item.title}
                          <CallMadeIcon
                            className="ext-icon"
                            sx={{ fontSize: 11, ml: 0.4, mb: "1px", opacity: 0, transition: "opacity 0.15s", verticalAlign: "middle" }}
                          />
                        </Link>
                      </Box>
                    </TableCell>

                    {/* Repository */}
                    <TableCell align="center" sx={cellSx}>
                      <Chip
                        label={item.repository_url.split("/").slice(-1)[0]}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: "20px", fontWeight: 500, borderRadius: "999px" }}
                      />
                    </TableCell>

                    {/* State */}
                    <TableCell align="center" sx={cellSx}>
                      {getStateChip(item)}
                    </TableCell>

                    {/* Created */}
                    <TableCell sx={{ ...cellSx, color: "text.secondary", whiteSpace: "nowrap", fontSize: "0.78rem" }}>
                      <Tooltip title="Open this item in GitHub">
                        <Box component="span">{formatDate(item.created_at)}</Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider />
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={ROWS_PER_PAGE}
              rowsPerPageOptions={[ROWS_PER_PAGE]}
              sx={{ fontSize: "0.78rem", borderTop: "none" }}
            />
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
