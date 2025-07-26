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
import { FaGithub } from "react-icons/fa"; // GitHub Icon
import axios from "axios";

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

  // Fetch contributors data from GitHub API
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/mehul-m-prajapati/github_tracker/contributors", {
            withCredentials : false
          }
        );
        setContributors(response.data);
      } catch (err) {
        setError("Failed to fetch contributors. Please try again later."+ err);
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
        backgroundColor: "#FFFFFF",
        color: "#333333",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Typography sx={{ pb: 2 }} variant="h4" align="center" gutterBottom>
        🤝 GitHub Contributors
      </Typography>
      <Grid container spacing={4}>
        {contributors.map((contributor) => (
          <Grid item xs={12} sm={6} md={4} key={contributor.id}>
            <Card
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: "#F9F9F9",
                color: "#333333",
                borderRadius: "10px",
                border: "1px solid #E0E0E0", // Border styling

                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)", // Zoom effect
                  boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                  borderColor: "#C0C0C0", // Change border color on hover
                  outlineColor: "#B3B3B3", // Change outline color on hover
                },
              }}
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
                <Typography variant="body2" color="textSecondary">
                  {contributor.contributions} Contributions
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Thank you for your valuable contributions to our community!
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FaGithub />}
                    href={contributor.html_url}
                    target="_blank"
                    sx={{
                      backgroundColor: "#333333",
                      color: "#FFFFFF",
                      "&:hover": {
                        backgroundColor: "#555555", // Custom hover color
                      },
                    }}
                  >
                    GitHub Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ContributorsPage;