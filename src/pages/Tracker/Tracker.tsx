import React, { useState, useEffect } from "react"
import Dashboard from "../../components/Dashboard";
import { useDebounce } from "../../hooks/useDebounce";
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
} from "@mui/material";
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

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString();


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


  // Current data according to tab
  const currentFilteredData = tab === 0 ? issues : prs;
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
            />
            <Button type="submit" variant="contained" sx={{ minWidth: "120px" }}>
              Fetch Data
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Dashboard Summary */}
      {username && (
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

export default Tracker;
