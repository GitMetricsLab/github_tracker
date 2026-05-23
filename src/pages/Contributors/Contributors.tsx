import { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa";
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
}

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch contributors from GitHub API
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

  const filteredContributors = contributors.filter((contributor) =>
    contributor.login.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      <Container maxWidth="lg">
        <Typography sx={{ pb: 2 }} variant="h4" align="center" gutterBottom>
          🤝 Contributors
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            width: "100%",
          }}
        >
          <TextField
            placeholder="Search contributors..."
            variant="outlined"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: {
                xs: "100%",
                sm: "400px",
              },
              maxWidth: "100%",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {filteredContributors.length === 0 && (
            <Typography
              variant="h6"
              align="center"
              sx={{
                mt: 4,
                color: "gray",
                fontWeight: 500,
              }}
            >
              No contributors found.
            </Typography>
          )}
          {filteredContributors.map((contributor) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={
                filteredContributors.length === 1
                  ? 12
                  : filteredContributors.length === 2
                    ? 6
                    : filteredContributors.length === 3
                      ? 4
                      : 3
              }
              key={contributor.id}
            >
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                  maxWidth: "300px",
                  mx: "auto",
                  borderRadius: "10px",
                  border: "1px solid #E0E0E0",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                    borderColor: "#C0C0C0",
                    outlineColor: "#B3B3B3",
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
                    {/*
                        <Typography variant="body2" sx={{ mt: 2 }}>
                        Thank you for your valuable contributions to our
                        community!
                        </Typography> */}
                  </CardContent>
                </Link>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FaGithub />}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: "#333333",
                      textTransform: "none",
                      color: "#FFFFFF",
                      "&:hover": {
                        backgroundColor: "#555555",
                      },
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
