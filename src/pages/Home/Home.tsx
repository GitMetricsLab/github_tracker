
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// import { useGitHubAuth } from "../../hooks/useGitHubAuth";
// import { useGitHubData } from "../../hooks/useGitHubData";
import { usePagination } from "../../hooks/usePagination";
import { BarChart3 } from "lucide-react";
import axios from 'axios';


const ROWS_PER_PAGE = 10;
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
  const theme = useTheme();
  // const {
  //   username,
  //   setUsername,
  //   token,
  //   setToken,
  //   error: authError,
  //   getOctokit,
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


  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);

  const [issueFilter, setIssueFilter] = useState("all");
  const [prFilter, setPrFilter] = useState("all");
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
      
      const response = await axios.post(`${backendUrl}/api/github/get-data`,{
        username, token
      }); //we get data from backend by providng username and token

      setIssues(response.data.issues);
      setPrs(response.data.prs);

    }catch(err:any){
      
      console.error('Error response:', err.response?.status, err.response?.statusText);
      setError(err.response?.data?.message || 'Failed to fetch GitHub data. Please check your credentials.');
      setIssues([]);
      setPrs([]);
    }
    finally{
      setLoading(false);
    }
  }
   

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();

    const isValid = await validateCredentials();
    if(isValid){
      fetchData();
    }

  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString();

  const filterData = (data: GitHubItem[], filterType: string): GitHubItem[] => {
    let filtered = [...data];
    if (["open", "closed", "merged"].includes(filterType)) {
      filtered = filtered.filter((item) =>
        filterType === "merged"
          ? !!item.pull_request?.merged_at
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

  // Current data and filtered data according to tab and filters
  const currentRawData = tab === 0 ? issues : prs;
  const currentFilteredData = filterData(
    currentRawData,
    tab === 0 ? issueFilter : prFilter
  );
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

      {(error) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
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
                    <TableCell>
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

export default Home;
