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

  // Fetch contributors from GitHub API
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        // REAL API CALL
        const response = await axios.get(
          GITHUB_REPO_CONTRIBUTORS_URL,
          {
            withCredentials: false,
          }
        );

        setContributors(response.data);

        /*
        // ==================================================
        // TEMPORARY TESTING CODE
        // Uncomment this block ONLY if you want to test
        // the rate limit UI manually.
        // ==================================================

        // // throw {
        // //   isAxiosError: true,
        // //   response: {
        // //     status: 403,
        // //     headers: {
        // //       "x-ratelimit-remaining": 0,
        // //       "x-ratelimit-reset": 1750000000,
        // //     },
        // //   },
        // // };

        // ==================================================
        // */
      } catch (error) {
        if (axios.isAxiosError(error)) {

          // GitHub API Rate Limit Error
          if (error.response?.status === 403) {

            const remaining =
              error.response.headers["x-ratelimit-remaining"];

            const reset =
              error.response.headers["x-ratelimit-reset"];

            let resetMessage = "";

            if (reset) {
              const resetTime = new Date(
                Number(reset) * 1000
              );

              resetMessage =
                ` Try again after ${resetTime.toLocaleTimeString()}.`;
            }

            setError(
              `GitHub API rate limit exceeded. Remaining requests: ${remaining}.${resetMessage}`
            );

          } else {

            setError(
              "Failed to fetch contributors. Please try again later."
            );

          }

        } else {

          setError(
            "An unexpected error occurred."
          );

        }
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error UI
  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-4 mt-4">
      <Container>
        <Typography
          sx={{ pb: 2 }}
          variant="h4"
          align="center"
          gutterBottom
        >
          🤝 Contributors
        </Typography>

        <Grid container spacing={4}>
          {contributors.map((contributor) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={contributor.id}
            >
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: "10px",
                  border: "1px solid #E0E0E0",
                  boxShadow:
                    "0 4px 10px rgba(0,0,0,0.1)",
                  transition:
                    "transform 0.3s ease-in-out",

                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow:
                      "0 8px 15px rgba(0,0,0,0.2)",
                    borderColor: "#C0C0C0",
                    outlineColor: "#B3B3B3",
                  },
                }}
              >
                <Link
                  to={`/contributor/${contributor.login}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Avatar
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                    }}
                  />

                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {contributor.login}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
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