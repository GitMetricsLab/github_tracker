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
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
// import { useGitHubAuth } from "../../hooks/useGitHubAuth";
// import { useGitHubData } from "../../hooks/useGitHubData";
//moving data fetching to the backend for security purpose - ashish-choudhari-git
import axios from 'axios';

const ROWS_PER_PAGE = 10;
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
  const navigate = useNavigate();

   //moved fetching to the backend routes - details.js

  // Hooks for managing user authentication
  // const {
  //   username,
  //   setUsername,
  //   token,
  //   setToken,
  //   error: authError,
  //   getOctokit,
  //   validateCredentials,
  // } = useGitHubAuth();

 
  // const octokit = getOctokit();
  // const {
  //   issues,
  //   prs,
  //   loading,
  //   error: dataError,
  //   fetchData,
  // } = useGitHubData(octokit);

  //state management
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [issues, setIssues] = useState<GitHubItem[]>([]);
  const [prs, setPrs] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


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

  //validation of username and token
  const validateCredentials= async()=>{
    if(!username.trim()){
      setError('Username is required.')
      return false;
    }
    if(!token.trim()){
      setError('Personal acess token is required.')
      return false;
    }

    setError('');
    return true;
  
  }

  // Navigate to analytics page with username and token
  const handleViewAnalytics = () => {
    if (!username.trim() || !token.trim()) {
      setError('Please enter username and token first');
      return;
    }
    // Pass username and token as state to analytics page
    navigate('/analytics', { 
      state: { 
        username: username.trim(), 
        token: token.trim() 
      } 
    });
  };



  //fetching data from backend
  const fetchData= async()=>{

    setLoading(true);
    setError('');

    try{
      
      console.log('Request payload:', { username, token: token ? 'PROVIDED' : 'MISSING' });
      
      const response = await axios.post(`${backendUrl}/api/github/get-data`,{
        username, token
      }); //we get data from backend by providng username and token

      setIssues(response.data.issues);
      setPrs(response.data.prs);

    }catch(err:any){
      
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || `Error fetching GitHub data: ${err.message}`);
      setIssues([]);
      setPrs([]);
    }
    finally{
      setLoading(false);
    }
  }



  // Handle data submission to fetch GitHub data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ashish-choudhari-git Code for security
    const isValid = await validateCredentials();
    if(isValid){
      fetchData();
    }
    
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
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
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
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: "120px", borderRadius: "8px" }}
              >
                {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleViewAnalytics}
                startIcon={<BarChart3 size={20} />}
                sx={{
                  minWidth: "140px",
                  borderRadius: "8px",
                  color: "secondary.main",
                  borderColor: "secondary.main",
                  "&:hover": {
                    borderColor: "secondary.dark",
                    backgroundColor: "secondary.light",
                    color: "secondary.dark",
                  },
                }}
              >
                {username && token ? 'View Analytics' : 'Enter Data First'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

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
    onChange={(_, newValue) => setTab(newValue)}
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
{(error) && (
<Alert severity="error" sx={{ mb: 3 }}>
    {error}
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
