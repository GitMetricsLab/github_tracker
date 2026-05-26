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

interface FetchError {
  message: string;
  isRateLimited: boolean;
  statusCode?: number;
}

// Custom error class for Contributors fetch errors
class ContributorsError extends Error {
  constructor(
    message: string,
    public isRateLimited = false,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ContributorsError";
  }
}

// Type guard to validate if data is Contributor[]
const isContributorArray = (data: unknown): data is Contributor[] => {
  if (!Array.isArray(data)) return false;
  return data.every((item) => {
    if (typeof item !== "object" || item === null) return false;

    // Validate all required fields with correct types
    return (
      typeof item.id === "number" &&
      typeof item.login === "string" &&
      typeof item.avatar_url === "string" &&
      typeof item.contributions === "number" &&
      typeof item.html_url === "string"
    );
  });
};

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  // Fetch contributors from GitHub API
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(GITHUB_REPO_CONTRIBUTORS_URL, {
          withCredentials: false,
          timeout: 10000,
        });

        // ✅ Validate response structure matches Contributor[]
        if (!isContributorArray(response.data)) {
          throw new ContributorsError(
            "Invalid API response structure. Expected array of contributors.",
            false
          );
        }

        setContributors(response.data);
      } catch (err) {
        const fetchError: FetchError = {
          message: "Failed to fetch contributors. Please try again later.",
          isRateLimited: false,
        };

        // Handle ContributorsError instances
        if (err instanceof ContributorsError) {
          fetchError.message = err.message;
          fetchError.isRateLimited = err.isRateLimited;
          fetchError.statusCode = err.statusCode;
        } else if (axios.isAxiosError(err)) {
          // Handle Axios errors
          if (err.response?.status === 403) {
            fetchError.message =
              "GitHub API rate limit exceeded. Try again later.";
            fetchError.isRateLimited = true;
            fetchError.statusCode = 403;
          } else if (err.response?.status === 404) {
            fetchError.message = "Repository not found.";
            fetchError.statusCode = 404;
          } else if (err.code === "ECONNABORTED") {
            fetchError.message = "Request timeout. Server took too long to respond.";
            fetchError.statusCode = 408;
          } else if (err.response?.status) {
            fetchError.message = `HTTP ${err.response.status}: Failed to fetch contributors`;
            fetchError.statusCode = err.response.status;
          } else if (err.message) {
            fetchError.message = err.message;
          }
        } else if (err instanceof Error) {
          fetchError.message = err.message || fetchError.message;
        }

        setError(fetchError);
        console.error("Contributors fetch error:", fetchError);
        setContributors([]);
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
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            ⚠️ {error.message}
          </Typography>
          {error.isRateLimited && (
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              You've hit GitHub's API rate limit. The limit resets in 1 hour.
            </Typography>
          )}
          {error.statusCode === 404 && (
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              Please verify the repository exists and is accessible.
            </Typography>
          )}
          {error.statusCode === 408 && (
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              The server took too long to respond. Please try again.
            </Typography>
          )}
        </Alert>
      </Box>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-4 mt-4">
      <Container>
        <Typography sx={{ pb: 2 }} variant="h4" align="center" gutterBottom>
          🤝 Contributors
        </Typography>

        <Grid container spacing={4}>
          {contributors.map((contributor) => (
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
