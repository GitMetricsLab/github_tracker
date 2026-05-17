import React, { useState, useEffect } from "react"
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitMergeIcon,
  GitCommitIcon,
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
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Typography,
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
  commit?: {
    message: string;
  };
  repository?: {
    html_url: string;
  };
  classifiedInfo?: {
    importance: string;
    category: string;
    score: number;
  };
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
    commits,
    totalIssues,
    totalPrs,
    totalCommits,
    loading,
    error: dataError,
    fetchData,
  } = useGitHubData(getOctokit);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);

  const [issueFilter, setIssueFilter] = useState("all");
  const [prFilter, setPrFilter] = useState("all");
  const [commitFilter, setCommitFilter] = useState("all");
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

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

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
    if (["High", "Medium", "Low"].includes(filterType)) {
      filtered = filtered.filter(item => item.classifiedInfo?.importance === filterType);
    }
    if (searchTitle) {
      filtered = filtered.filter((item) => {
        const title = item.commit ? item.commit.message : item.title;
        return title.toLowerCase().includes(searchTitle.toLowerCase());
      });
    }
    if (selectedRepo) {
      filtered = filtered.filter((item) => {
        const repoUrl = item.repository?.html_url || item.repository_url;
        return (repoUrl || '').includes(selectedRepo);
      });
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

    if (item.commit) {
      return <GitCommitIcon size={16} className="icon-commit" />;
    }

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
  const currentRawData = tab === 0 ? issues : (tab === 1 ? prs : commits);
  const currentFilter = tab === 0 ? issueFilter : (tab === 1 ? prFilter : commitFilter);
  const currentFilteredData = filterData(currentRawData, currentFilter);
  const totalCount = tab === 0 ? totalIssues : (tab === 1 ? totalPrs : totalCommits);

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
              sx={{ flex: 1, minWidth: 150 }}
              // Helper link to guide users on generating a GitHub Personal Access Token
              helperText={
                <Link
                href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
      fontSize: '0.75rem',
      color: 'primary.main',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      }
    }}
                >
                  How to generate?
                </Link>
              }
            />

            <Button type="submit" variant="contained" sx={{ minWidth: "120px" }}>
              Fetch Data
            </Button>
          </Box>
        </form>
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
          <Tab label={`Commits (${totalCommits})`} />
        </Tabs>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: "14px" }}>{tab === 2 ? 'Importance' : 'State'}</InputLabel>
          <Select
            value={currentFilter}
            onChange={(e) => {
              if (tab === 0) setIssueFilter(e.target.value);
              else if (tab === 1) setPrFilter(e.target.value);
              else setCommitFilter(e.target.value);
            }}
            label={tab === 2 ? 'Importance' : 'State'}
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
            {tab !== 2 && (
              <>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                {tab === 1 && <MenuItem value="merged">Merged</MenuItem>}
              </>
            )}
            {tab === 2 && (
              <>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Unknown">Unknown</MenuItem>
              </>
            )}
          </Select>
        </FormControl>
      </Box>

      {(authError || dataError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {authError || dataError}
        </Alert>
      )}

      {loading ? (
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
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="text" width="80%" height={30} />
              </TableCell>

              <TableCell align="center">
                <Skeleton variant="text" width="60%" height={30} />
              </TableCell>

              <TableCell align="center">
                <Skeleton variant="rounded" width={70} height={25} />
              </TableCell>

              <TableCell>
                <Skeleton variant="text" width="70%" height={30} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
) : !authError && !dataError && currentFilteredData.length === 0 ? (
  <Paper
    elevation={1}
    sx={{
      p: 4,
      textAlign: "center",
      backgroundColor: theme.palette.background.paper,
    }}
  >
    <Typography variant="h6" gutterBottom>
      No Data Found
    </Typography>

    <Typography variant="body2" color="text.secondary">
      Try adjusting filters or searching for another GitHub user.
    </Typography>
  </Paper>
) : (
    
  <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>

          <TableContainer component={Paper}>

            <Table size="small">

              <TableHead>
                <TableRow>
                  <TableCell>Title / Message</TableCell>
                  <TableCell align="center">Repository</TableCell>
                  <TableCell align="center">Status / Importance</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {currentFilteredData.map((item) => (
                  <TableRow key={item.id}>

                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(item)}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Link
                              href={item.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{ color: theme.palette.primary.main, wordBreak: 'break-word', maxWidth: '300px' }}
                          >
                              {item.commit ? item.commit.message.split('\n')[0] : item.title}
                          </Link>
                          {item.classifiedInfo && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Box sx={{ fontSize: '0.75rem', px: 1, py: 0.25, borderRadius: '12px', bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}>
                                {item.classifiedInfo.category}
                              </Box>
                            </Box>
                          )}
                        </Box>
                    </TableCell>


                    <TableCell align="center">
                      {(item.repository?.html_url || item.repository_url || "").split("/").slice(-1)[0]}
                    </TableCell>

                    <TableCell align="center">
                      {item.commit ? (
                        <Box component="span" sx={{
                          px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.8rem',
                          bgcolor: item.classifiedInfo?.importance === 'High' ? 'error.light' : (item.classifiedInfo?.importance === 'Medium' ? 'warning.light' : (item.classifiedInfo?.importance === 'Low' ? 'success.light' : 'grey.300')),
                          color: 'black'
                        }}>
                          {item.classifiedInfo?.importance}
                        </Box>
                      ) : (
                        item.pull_request?.merged_at ? "merged" : item.state
                      )}
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
