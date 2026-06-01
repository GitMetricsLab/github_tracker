import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { GITHUB_REPO_CONTRIBUTORS_URL } from "../../utils/constants";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
  type?: string; 
}

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minPRs, setMinPRs] = useState<string>("");
  const [prType, setPrType] = useState<string>("all");

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get(GITHUB_REPO_CONTRIBUTORS_URL, {
          withCredentials: false,
        });
        setContributors(response.data);
      } catch {
        setError("Failed to fetch contributors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  const handleClearFilters = () => {
    setSearch("");
    setSortOrder("desc");
    setMinPRs("");
    setPrType("all");
  };

  const filtered = useMemo(() => {
    return contributors
      .filter((c) => {
        const matchesSearch = c.login.toLowerCase().includes(search.toLowerCase());
        const matchesMinPR = minPRs === "" || c.contributions >= parseInt(minPRs, 10);
        const matchesType = prType === "all" || (c.type && c.type.toLowerCase() === prType.toLowerCase());
        return matchesSearch && matchesMinPR && matchesType;
      })
      .sort((a, b) => {
        if (sortOrder === "desc") {
          return b.contributions - a.contributions;
        }
        return a.contributions - b.contributions;
      });
  }, [contributors, search, sortOrder, minPRs, prType]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-4 mt-4">
      <Container>
        <Typography sx={{ pb: 2 }} variant="h4" align="center" gutterBottom>
          🤝 Contributors
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            label="Search by username"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Min PR Count"
            type="number"
            variant="outlined"
            size="small"
            value={minPRs}
            onChange={(e) => setMinPRs(e.target.value)}
            sx={{ width: 130 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>PR Type</InputLabel>
            <Select
              value={prType}
              label="PR Type"
              onChange={(e) => setPrType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="merged">Merged</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort by Contributions</InputLabel>
            <Select
              value={sortOrder}
              label="Sort by Contributions"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="desc">Most to Least</MenuItem>
              <MenuItem value="asc">Least to Most</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleClearFilters}
            sx={{ textTransform: "none", height: 40 }}
          >
            Clear Filters
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
          Showing {filtered.length} of {contributors.length} contributors
        </Typography>

        <Grid container spacing={4}>
          {filtered.map((contributor) => (
            <Grid item xs={12} sm={6} md={3} key={contributor.id}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: "10px",
                  border: "1px solid #E0E0E0",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                    borderColor: "#C0C0C0",
                  },
                }}
              >
                <Link
                  to={`/contributor/${contributor.login}`}
                  style={{ textDecoration: "none" }}
                >
                  <Avatar
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {contributor.login}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contributor.contributions} Contributions
                    </Typography>
                  </CardContent>
                </Link>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FaGithub />}
                    href={contributor.html_url}
                    target="_blank"
                    sx={{
                      backgroundColor: "#333333",
                      textTransform: "none",
                      color: "#FFFFFF",
                      "&:hover": { backgroundColor: "#555555" },
                    }}
                  >
                    GitHub
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ContributorsPage;
