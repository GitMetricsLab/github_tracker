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
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

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
  const { theme } = useTheme();

  // Theme-based colors
  const bgColor = theme === "dark" ? "#1f1f1f" : "#FFFFFF";
  const textColor = theme === "dark" ? "#FFFFFF" : "#333333";
  const cardBg = theme === "dark" ? "#2a2a2a" : "#FFFFFF";
  const borderColor = theme === "dark" ? "#444444" : "#E0E0E0";
  const hoverBorder = theme === "dark" ? "#666666" : "#C0C0C0";

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/mehul-m-prajapati/github_tracker/contributors",
          { withCredentials: false }
        );
        setContributors(response.data);
      } catch (err) {
        setError("Failed to fetch contributors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  // To trigger re-render on theme change (optional)
  useEffect(() => {
    setContributors((prev) => [...prev]);
  }, [theme]);

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
        backgroundColor: bgColor,
        color: textColor,
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
              to={`/user/${contributor.login}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  backgroundColor: cardBg,
                  color: textColor,
                  borderRadius: "12px",
                  border: `1px solid ${borderColor}`,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                    borderColor: hoverBorder,
                  },
                }}
              >
                <Avatar
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  sx={{ width: 100, height: 100, mx: "auto", mt: 3 }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: textColor }}
                  >
                    {contributor.login}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: textColor }}>
                    {contributor.contributions} Contributions
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: textColor }}>
                    Thank you for your valuable contributions!
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<FaGithub />}
                      href={contributor.html_url}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
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
