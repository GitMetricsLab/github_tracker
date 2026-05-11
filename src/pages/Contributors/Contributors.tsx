import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Trophy, Users } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("contributions");

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

  const filteredContributors = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return [...contributors]
      .filter((contributor) =>
        contributor.login.toLowerCase().includes(normalizedSearch)
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.login.localeCompare(b.login);
        }

        return b.contributions - a.contributions;
      });
  }, [contributors, searchTerm, sortBy]);

  const totalContributions = useMemo(
    () =>
      contributors.reduce(
        (total, contributor) => total + contributor.contributions,
        0
      ),
    [contributors]
  );

  const topContributor = contributors[0];

  if (loading) {
    return (
      <Box sx={{ width: "100%", minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">Loading contributors...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box className="w-full bg-slate-50 text-black dark:bg-gray-950 dark:text-white">
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={3}
              >
                <Box>
                  <Chip
                    icon={<Users size={16} />}
                    label="Community directory"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 2, fontWeight: 700 }}
                  />
                  <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: 0 }}>
                    Contributors
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
                    Discover the people helping GitHub Tracker move forward. Search,
                    sort, and open profile details from one clean directory.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                    gap: 1.5,
                    minWidth: { md: 480 },
                  }}
                >
                  <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={900}>
                      {contributors.length}
                    </Typography>
                    <Typography color="text.secondary" fontSize={13}>
                      Contributors
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={900}>
                      {totalContributions}
                    </Typography>
                    <Typography color="text.secondary" fontSize={13}>
                      Contributions
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={900} noWrap>
                      {topContributor?.login ?? "-"}
                    </Typography>
                    <Typography color="text.secondary" fontSize={13}>
                      Top contributor
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 220px" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Search contributor"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <MenuItem value="contributions">Most contributions</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {filteredContributors.length === 0 ? (
            <Card
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 4,
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography variant="h5" fontWeight={900}>
                No contributors found
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Try another username or clear the search field.
              </Typography>
            </Card>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {filteredContributors.map((contributor, index) => (
                <Card
                  key={contributor.id}
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 160ms ease, box-shadow 160ms ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5} alignItems="center" textAlign="center">
                      <Box sx={{ position: "relative" }}>
                        <Avatar
                          src={contributor.avatar_url}
                          alt={contributor.login}
                          sx={{ width: 96, height: 96 }}
                        />
                        {index < 3 && sortBy === "contributions" && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: -6,
                              bottom: -6,
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              display: "grid",
                              placeItems: "center",
                              border: "3px solid",
                              borderColor: "background.paper",
                            }}
                          >
                            <Trophy size={16} />
                          </Box>
                        )}
                      </Box>

                      <Box>
                        <Typography variant="h6" fontWeight={900} noWrap>
                          {contributor.login}
                        </Typography>
                        <Chip
                          label={`${contributor.contributions} contributions`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 1, fontWeight: 700 }}
                        />
                      </Box>

                      <Stack direction="row" spacing={1} width="100%">
                        <Button
                          component={Link}
                          to={`/contributor/${contributor.login}`}
                          variant="contained"
                          fullWidth
                          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="outlined"
                          href={contributor.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ minWidth: 48, borderRadius: 2 }}
                          aria-label={`${contributor.login} on GitHub`}
                        >
                          <FaGithub />
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ContributorsPage;
