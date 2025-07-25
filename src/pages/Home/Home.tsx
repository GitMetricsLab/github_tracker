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
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import { usePagination } from "../../hooks/usePagination";

const ROWS_PER_PAGE = 10;

// Define the shape of the data received from GitHub
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
  // Hooks for managing user authentication
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

  // State for various filters and tabs
  const [tab, setTab] = useState(0);
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [prFilter, setPrFilter] = useState<string>("all");
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Handle data submission to fetch GitHub data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchData(username);
  };

  // Format date strings into a readable format
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter data based on selected criteria
  const filterData = (
    data: GitHubItem[],
    filterType: string
  ): GitHubItem[] => {
    let filteredData = [...data];

    if (filterType === "open" || filterType === "closed" || filterType === "merged") {
      filteredData = filteredData.filter((item) =>
        filterType === "merged"
          ? item.pull_request?.merged_at
          : item.state === filterType
      );
    }

    if (searchTitle) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (selectedRepo) {
      filteredData = filteredData.filter((item) =>
        item.repository_url.includes(selectedRepo)
      );
    }

    if (startDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.created_at) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.created_at) <= new Date(endDate)
      );
    }

    return filteredData;
  };

  // Determine the current tab's data
  const currentData =
    tab === 0 ? filterData(issues, issueFilter) : filterData(prs, prFilter);

  // Paginate the filtered data
  const displayData = paginateData(currentData);

  // Main UI rendering
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "78vh",
        mt: 4,
      }}
    >
      {/* Authentication Form */}
      <div
        style={{
          marginBottom: "2.5rem",
          padding: "2.5rem 2rem",
          borderRadius: "22px",
          background: "rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "370px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1.3rem",
          }}
          autoComplete="off"
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "1.2rem",
              color: "#232946",
              fontWeight: 700,
              letterSpacing: "1px",
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            GitHub Login
          </h2>
          <input
            type="text"
            placeholder="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              border: "none",
              background: "rgba(255,255,255,0.35)",
              fontSize: "1rem",
              outline: "none",
              boxShadow: "0 2px 8px rgba(31,38,135,0.07)",
              color: "#232946",
            }}
          />
          <input
            type="password"
            placeholder="Personal Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              border: "none",
              background: "rgba(255,255,255,0.35)",
              fontSize: "1rem",
              outline: "none",
              boxShadow: "0 2px 8px rgba(31,38,135,0.07)",
              color: "#232946",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.9rem 1rem",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(31,38,135,0.07)",
              transition: "background 0.2s",
              letterSpacing: "0.5px",
            }}
          >
            Fetch Data
          </button>
        </form>
      </div>

      {/* Filters Section */}
      <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
  }}
>
  {/* Search Title */}
  <TextField
    label="Search Title"
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
    sx={{
      flexBasis: { xs: "100%", sm: "100%", md: "48%", lg: "23%" },
      flexGrow: 1,
    }}
  />

  {/* Repository */}
  <TextField
    label="Repository"
    value={selectedRepo}
    onChange={(e) => setSelectedRepo(e.target.value)}
    sx={{
      flexBasis: { xs: "100%", sm: "100%", md: "48%", lg: "23%" },
      flexGrow: 1,
    }}
  />

  {/* Start Date */}
  <TextField
    label="Start Date"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    sx={{
      flexBasis: { xs: "100%", sm: "100%", md: "48%", lg: "23%" },
      flexGrow: 1,
    }}
  />

  {/* End Date */}
  <TextField
    label="End Date"
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    sx={{
      flexBasis: { xs: "100%", sm: "100%", md: "48%", lg: "23%" },
      flexGrow: 1,
    }}
  />
</Box>


{/* Tabs and State Dropdown */}
<Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    mb: 3,
    mt:3
  }}
>
  <Tabs
    value={tab}
    onChange={(e, newValue) => setTab(newValue)}
    variant="scrollable"
    scrollButtons="auto"
    sx={{ flexGrow: 1, minWidth: "200px" }}
  >
    <Tab label={`Issues (${filterData(issues, issueFilter).length})`} />
    <Tab label={`Pull Requests (${filterData(prs, prFilter).length})`} />
  </Tabs>

  <FormControl sx={{ minWidth: 150 }}>
    <InputLabel sx={{ fontSize: "14px", color: "#555" }}>State</InputLabel>
    <Select
      value={tab === 0 ? issueFilter : prFilter}
      onChange={(e) =>
        tab === 0
          ? setIssueFilter(e.target.value as string)
          : setPrFilter(e.target.value as string)
      }
      label="State"
      sx={{
        backgroundColor: "#fff",
        borderRadius: "4px",
        "& .MuiSelect-select": { padding: "10px" },
      }}
    >
      <MenuItem value="all">All</MenuItem>
      <MenuItem value="open">Open</MenuItem>
      <MenuItem value="closed">Closed</MenuItem>
      {tab === 1 && <MenuItem value="merged">Merged</MenuItem>}
    </Select>
  </FormControl>
</Box>


{/* Error Alert */}
{(authError || dataError) && (
<Alert severity="error" sx={{ mb: 3 }}>
    {authError || dataError}
</Alert>
)}

{/* Table Section */}
{loading ? (
<Box display="flex" justifyContent="center" my={4}>
    <CircularProgress />
</Box>
) : (
<Box>
<Box sx={{ overflowX: "auto", width: "100%" }}>
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
        {displayData.map((item: GitHubItem) => (
          <TableRow key={item.id}>
            <TableCell>
              <Link href={item.html_url} target="_blank" rel="noopener noreferrer">
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
