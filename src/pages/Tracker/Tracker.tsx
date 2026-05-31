import { CodingPersonaWidget } from '../../components/CodingPersonaWidget';
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
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import { useGitHubProfile } from "../../hooks/useProfileData";
import { useGitHubRepositories } from "../../hooks/useGithubRepos";
import { useGitHubActivity } from "../../hooks/useGithubActivity";

import { KeyIcon } from "lucide-react";
import Dashboard from "../../components/Dashboard";


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
  const [hasFetched, setHasFetched] = useState(false);
  const [issueFilter, setIssueFilter] = useState("all");
  const [prFilter, setPrFilter] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch data when tab or page changes
  useEffect(() => {
    if (username) {
      fetchData(username, page + 1, ROWS_PER_PAGE);
    }
  }, [tab, page]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setPage(0);
    fetchProfile(username);
    fetchRepositories(username);
    fetchActivity(username);
    fetchData(username, 1, ROWS_PER_PAGE);
    setHasFetched(true);
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

  // const profileStats = useProfileData(
  //   issues,
  //   prs,
  //   username
  // )

  const {
    profile,
    fetchProfile,
  } = useGitHubProfile(getOctokit);

  const {
    repos,
    totalStars,
    totalForks,
    topRepositories,
    languages,
    fetchRepositories,
  } = useGitHubRepositories(getOctokit);

  const {
    activities,
    fetchActivity
  } = useGitHubActivity(getOctokit)
  useEffect(() => {
    if (
      !profile ||
      repos == null ||
      activities == null
    ) {
      return;
    }
    try {
      const gitHubDashBoard = {
        profile,
        repositories: {
          repos,
          totalStars,
          totalForks,
          topRepositories,
          languages,
        },
        analytics: {
          totalIssues,
          totalPrs,
        },
        activities,
      };
      localStorage.setItem(
        "githubDashboard",
        JSON.stringify(gitHubDashBoard)
      );
    } catch (error) {
      console.error(
        "Something went wrong while saving profile or RepoStats.",
        error
      );
    }
  }, [
    profile,
    repos,
    totalStars,
    totalForks,
    topRepositories,
    languages,
    totalIssues,
    totalPrs,
    activities,
  ]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, minHeight: "80vh", color: theme.palette.text.primary }}>
      {/* Auth Input Controls */}
      <Paper elevation={1} sx={{ p: 2, mb: 4, backgroundColor: theme.palette.background.paper }}>
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
        </Box>
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

      {/* 🌟 FIXED WIDGET ARRAY PROPS DATA PIPELINE 🌟 */}
      {/* Feeds both dataset logs together seamlessly to prevent premature pagination caps */}
      {!loading && (issues.length > 0 || prs.length > 0) && (
        <Box sx={{ mb: 2 }}>
          <CodingPersonaWidget issues={issues} pullRequests={prs} />
        </Box>
      )}

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
              & .MuiSelect-select: { padding: "10px" },
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
        <Box sx={{padding:2}}>
          {[1,2,3,4,5].map((row)=>(
            <Box 
            key={row}
            sx={{
              display:"flex",
              marginBottom:2,
              gap:2,
            }}
            >
            <Skeleton variant="text" width={250}
       height={35}/>
            <Skeleton variant="rectangular" width={120}
       height={35}/>
            <Skeleton variant="rectangular" width={100}
       height={35}/>
            <Skeleton variant="rectangular" width={120}
       height={35}/>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          <Dashboard
            data={currentFilteredData}
            theme={theme}
          />
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
                {currentFilteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No GitHub activity found with current filters.
                    </TableCell>
                  </TableRow>
                )}
                {hasFetched && currentFilteredData.map((item) => (
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
        </>
      )}
    </Container>
  );
};

export default Home;