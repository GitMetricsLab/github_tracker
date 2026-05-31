import React, { useState, useEffect, useContext } from "react"
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
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import ContributionRecommender from "../../components/ContributionRecommender";
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

  const theme = useTheme();
  const userContext = useContext(UserContext);

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
                sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.75rem" }}
              >
                <Link
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: "0.75rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 0.5 }}
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
        </Box>
      </Paper>

      {dailyActivityLoaded && <DailyActivityStatus {...dailyActivity} />}

      {submittedUsername && (
        <ContributionRecommender
          username={submittedUsername}
          getOctokit={getOctokit}
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
            id="state-select"
            name="state-select"
            autoComplete="off"
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

      {dataError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {dataError}
        </Alert>
      )}

      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          mb: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Contribution Score
            </Typography>
            <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>
              {contributionScore.total}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(120px, 1fr))",
              },
              gap: 2,
              flex: 1,
              minWidth: { xs: "100%", md: 0 },
            }}
          >
            {scoreItems.map((item) => (
              <Box
                key={item.label}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h6" component="p">
                  {item.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.points} pts - {item.weight}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

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
  {(() => {
    const repoName = item.repository_url.split("/").slice(-1)[0];
    const language = getLanguageFromRepo(repoName);
    const color = LANGUAGE_COLORS[language] || "#9ca3af";

    return (
      <Tooltip title={`Language: ${language}`} arrow>
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: color,
              display: "inline-block",
            }}
          />
          {repoName}
        </Box>
      </Tooltip>
    );
  })()}
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
      <BackToTopButton/>
    </Container>
  );
};

export default Home;