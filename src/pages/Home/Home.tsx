import React, { useState } from "react";
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
import { usePagination } from "../../hooks/usePagination";

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
  const octokit = getOctokit();
  const {
    issues,
    prs,
    loading,
    error: dataError,
    fetchData,
  } = useGitHubData(octokit);
  const { page, itemsPerPage, handleChangePage, paginateData } =
    usePagination(ROWS_PER_PAGE);

  const [tab, setTab] = useState(0);
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [prFilter, setPrFilter] = useState<string>("all");
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchData(username);
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString();

  const filterData = (data: GitHubItem[], filterType: string): GitHubItem[] => {
    let filtered = [...data];
    if (["open", "closed", "merged"].includes(filterType)) {
      filtered = filtered.filter((item) =>
        filterType === "merged"
          ? item.pull_request?.merged_at
          : item.state === filterType
      );
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

  const currentData =
    tab === 0 ? filterData(issues, issueFilter) : filterData(prs, prFilter);
  const displayData = paginateData(currentData);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "78vh",
        mt: 4,
        color: theme.palette.text.primary,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <TextField
              label="Personal Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              required
              sx={{ flex: 1 }}
            />
            <Button type="submit" variant="contained" sx={{ minWidth: "120px" }}>
              Fetch Data
            </Button>
          </Box>
        </form>
      </Paper>

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
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ flex: 1 }}>
          <Tab label={`Issues (${filterData(issues, issueFilter).length})`} />
          <Tab label={`Pull Requests (${filterData(prs, prFilter).length})`} />
        </Tabs>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: "14px" }}>State</InputLabel>
          <Select
            value={tab === 0 ? issueFilter : prFilter}
            onChange={(e) =>
              tab === 0
                ? setIssueFilter(e.target.value as string)
                : setPrFilter(e.target.value as string)
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
        <Box>
          <Box sx={{ maxHeight: "400px", overflowY: "auto", display: "block" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: "left" }}>Title</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Repository</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>State</TableCell>
                    <TableCell sx={{ textAlign: "left" }}>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayData.map((item: GitHubItem) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ textAlign: "left" }}>
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
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.repository_url.split("/").slice(-1)[0]}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.pull_request?.merged_at ? "merged" : item.state}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        {formatDate(item.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                               </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={currentData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={itemsPerPage}
                rowsPerPageOptions={[5]}
              />
            </TableContainer>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Home;