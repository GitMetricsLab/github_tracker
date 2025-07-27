import { useEffect, useState } from "react";
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
import axios from "axios";
import { Link } from "react-router-dom"; // ✅ Added

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

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/GitMetricsLab/github_tracker/contributors",
          { withCredentials: false }
        );
        setContributors(response.data);
      } catch (err) {
        setError("Failed to fetch contributors. Please try again later. " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

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
    <Container
      sx={{
        mt: 4,
        minHeight: "100vh",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.2rem" },
          fontWeight: "bold",
          mb: 3,
        }}
      >
        🤝 GitHub Contributors
      </Typography>

      <Grid container spacing={3}>
        {contributors.map((contributor) => (
          <Grid item xs={12} sm={6} md={4} key={contributor.id}>
            <Link
              to={`/user/${contributor.login}`} // ✅ Add link to user profile
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#F9F9F9",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
                    borderColor: "#ccc",
                  },
                }}
              >
                <Avatar
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                      color: "#333",
                    }}
                  >
                    {contributor.login}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {contributor.contributions} Contributions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, fontSize: { xs: "0.85rem", sm: "1rem" } }}
                  >
                    Thank you for your valuable contributions!
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<FaGithub />}
                      href={contributor.html_url}
                      target="_blank"
                      sx={{
                        backgroundColor: "#24292f",
                        color: "#fff",
                        fontSize: { xs: "0.75rem", sm: "0.85rem" },
                        px: 2,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "#444",
                        },
                      }}
                      onClick={(e) => e.stopPropagation()} // prevent nested Link trigger
                    >
                      GitHub Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ContributorsPage;
