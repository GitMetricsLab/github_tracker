import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  Avatar,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { Users, Star, Trophy } from "lucide-react";
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

  const rankedContributors = [...contributors].sort(
    (a, b) => b.contributions - a.contributions
  );
  const podiumContributors = rankedContributors.slice(0, 3);
  const remainingContributors = rankedContributors.slice(3);
  const totalContributions = contributors.reduce(
    (sum, contributor) => sum + contributor.contributions,
    0
  );
  const averageContributions =
    contributors.length > 0
      ? Math.round(totalContributions / contributors.length)
      : 0;

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

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-16 text-slate-900 transition-colors duration-500 dark:bg-[#030712] dark:text-white">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_72%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)]" />
        <Container maxWidth="xl" className="relative z-10">
          <Box className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center rounded-[2rem] border border-slate-200/80 bg-white/75 px-6 py-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/60">
            <Box>
              <CircularProgress sx={{ mb: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Loading contributors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pulling the latest GitHub activity and arranging the spotlight.
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-16 text-slate-900 transition-colors duration-500 dark:bg-[#030712] dark:text-white">
        <Container maxWidth="xl" className="relative z-10">
          <Alert severity="error" sx={{ borderRadius: 4, boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)" }}>
            {error}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-500 dark:bg-[#030712] dark:text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_72%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)]" />
      <div className="absolute left-1/4 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-400/10 blur-[120px] pointer-events-none dark:bg-cyan-400/10" />
      <div className="absolute bottom-16 right-0 h-[30rem] w-[30rem] translate-x-1/3 rounded-full bg-cyan-400/10 blur-[140px] pointer-events-none dark:bg-blue-500/10" />

      <Container maxWidth="xl" className="relative z-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/60 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Chip
                label="Community pulse"
                sx={{
                  alignSelf: "flex-start",
                  borderRadius: 999,
                  bgcolor: "rgba(59, 130, 246, 0.08)",
                  color: "#2563eb",
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  "& .MuiChip-label": { px: 1.25 },
                }}
              />

              <div className="space-y-3">
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 0.95,
                    letterSpacing: -1.5,
                    fontSize: { xs: "2.4rem", sm: "3.25rem", lg: "4.2rem" },
                  }}
                >
                  Meet the people
                  <span className="mt-2 block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
                    powering the project
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 780, fontSize: { xs: "0.98rem", md: "1.08rem" }, lineHeight: 1.7 }}
                >
                  A more expressive view of the contributors behind this repo, with a spotlight on top activity,
                  better hierarchy, and cleaner cards that feel deliberate on every screen size.
                </Typography>
              </div>
            </div>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Box sx={summaryPillStyles}>
                <Users className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                <Box>
                  <Typography sx={summaryValueStyles}>{contributors.length}</Typography>
                  <Typography sx={summaryLabelStyles}>Contributors</Typography>
                </Box>
              </Box>
              <Box sx={summaryPillStyles}>
                <Star className="h-4 w-4 text-amber-500" />
                <Box>
                  <Typography sx={summaryValueStyles}>{totalContributions}</Typography>
                  <Typography sx={summaryLabelStyles}>Total contributions</Typography>
                </Box>
              </Box>
              <Box sx={summaryPillStyles}>
                <Trophy className="h-4 w-4 text-emerald-500" />
                <Box>
                  <Typography sx={summaryValueStyles}>{averageContributions}</Typography>
                  <Typography sx={summaryLabelStyles}>Average per person</Typography>
                </Box>
              </Box>
            </Stack>
          </div>
        </section>

        {podiumContributors.length > 0 ? (
          <section className="mt-6 rounded-[2rem] border border-slate-200/80 bg-white/55 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/35 sm:p-6">
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 5,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(6,182,212,0.08) 48%, rgba(15,23,42,0.03))",
                boxShadow: "0 18px 50px rgba(15, 23, 42, 0.12)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.14),transparent_30%)]" />
              <Box sx={{ position: "relative", p: { xs: 2.5, sm: 4, lg: 5 } }}>
                <Chip
                  label="Top 3 podium"
                  sx={{
                    mb: 2,
                    borderRadius: 999,
                    bgcolor: "rgba(15, 23, 42, 0.08)",
                    color: "text.primary",
                    fontWeight: 800,
                    letterSpacing: 0.4,
                  }}
                />

                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1, mb: 1 }}>
                  Podium leaders
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.7, mb: 3 }}>
                  The top three contributors get a dedicated stage, while everyone else continues in the regular grid below.
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                    alignItems: "end",
                    gap: 2,
                  }}
                >
                  {[
                    { contributor: podiumContributors[1], rank: 2, height: 196, accent: "#64748b", label: "Second place" },
                    { contributor: podiumContributors[0], rank: 1, height: 248, accent: "#f59e0b", label: "Champion" },
                    { contributor: podiumContributors[2], rank: 3, height: 172, accent: "#0ea5e9", label: "Third place" },
                  ].map(({ contributor, rank, height, accent, label }) =>
                    contributor ? (
                      <Box
                        key={contributor.id}
                        sx={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          minHeight: { xs: 0, sm: height },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            borderRadius: 5,
                            border: "1px solid",
                            borderColor: "divider",
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))",
                            boxShadow: "0 16px 34px rgba(15, 23, 42, 0.12)",
                            p: 2.25,
                            pb: 2.5,
                            textAlign: "center",
                            transform: rank === 1 ? "translateY(-12px) scale(1.02)" : undefined,
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              top: 0,
                              height: 6,
                              borderTopLeftRadius: 20,
                              borderTopRightRadius: 20,
                              backgroundColor: accent,
                            }}
                          />
                          <Chip label={label} size="small" sx={{ mt: 0.5, borderRadius: 999, fontWeight: 800, bgcolor: `${accent}14`, color: accent }} />
                          <Box sx={{ position: "relative", mt: 2, mb: 1.75, display: "inline-flex" }}>
                            <Avatar
                              src={contributor.avatar_url}
                              alt={contributor.login}
                              sx={{
                                width: rank === 1 ? 104 : 88,
                                height: rank === 1 ? 104 : 88,
                                mx: "auto",
                                objectFit: "cover",
                                border: "4px solid",
                                borderColor: "background.paper",
                                boxShadow: "0 0 0 1px rgba(148, 163, 184, 0.36), 0 12px 24px rgba(15, 23, 42, 0.14)",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                right: -4,
                                bottom: -4,
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: accent,
                                color: "#fff",
                                fontWeight: 900,
                                boxShadow: "0 10px 22px rgba(15, 23, 42, 0.18)",
                              }}
                            >
                              {rank}
                            </Box>
                          </Box>

                          <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                            {contributor.login}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontWeight: 700 }}>
                            {contributor.contributions} contributions
                          </Typography>

                          <Button
                            component={Link}
                            to={`/contributor/${contributor.login}`}
                            variant="outlined"
                            fullWidth
                            sx={{
                              mt: 2,
                              borderRadius: 999,
                              textTransform: "none",
                              fontWeight: 800,
                              borderColor: `${accent}55`,
                              color: accent,
                              "&:hover": {
                                borderColor: accent,
                                backgroundColor: `${accent}08`,
                              },
                            }}
                          >
                            View profile
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box key={rank} />
                    )
                  )}
                </Box>
              </Box>
            </Card>
          </section>
        ) : null}

        <section className="mt-6 pb-6 sm:pb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                Contributors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ranked by contribution activity.
              </Typography>
            </div>
            <Chip
              label={`${contributors.length} profiles`}
              sx={{
                borderRadius: 999,
                bgcolor: "rgba(59, 130, 246, 0.08)",
                color: "#2563eb",
                fontWeight: 700,
              }}
            />
          </div>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="stretch">
            {remainingContributors.map((contributor, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={contributor.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.08)",
                    transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.92))",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 35%), radial-gradient(circle at bottom left, rgba(6,182,212,0.1), transparent 32%)",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 22px 42px rgba(15, 23, 42, 0.14)",
                      borderColor: "rgba(59, 130, 246, 0.35)",
                    },
                    "&:focus-within": {
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.22), 0 22px 42px rgba(15, 23, 42, 0.14)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      p: 2.5,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Chip
                        label={`#${index + 4}`}
                        size="small"
                        sx={{
                          borderRadius: 999,
                          fontWeight: 800,
                          bgcolor: index === 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(59, 130, 246, 0.08)",
                          color: index === 0 ? "#059669" : "#2563eb",
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.8 }}>
                        {contributor.contributions} contributions
                      </Typography>
                    </Box>

                    <Link
                      to={`/contributor/${contributor.login}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1.4,
                          textAlign: "center",
                        }}
                      >
                        <Avatar
                          src={contributor.avatar_url}
                          alt={contributor.login}
                          sx={{
                            width: 104,
                            height: 104,
                            objectFit: "cover",
                            border: "4px solid",
                            borderColor: "background.paper",
                            boxShadow: "0 0 0 1px rgba(148, 163, 184, 0.36), 0 12px 24px rgba(15, 23, 42, 0.14)",
                          }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.55 }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                            {contributor.login}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            GitHub profile ready to explore
                          </Typography>
                        </Box>
                      </Box>
                    </Link>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<FaGithub />}
                      href={contributor.html_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${contributor.login} on GitHub`}
                      sx={{
                        mt: 2,
                        py: 1.15,
                        borderRadius: 999,
                        backgroundColor: "#24292f",
                        textTransform: "none",
                        color: "#FFFFFF",
                        fontWeight: 800,
                        boxShadow: "none",
                        transition: "transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
                        "&:hover": {
                          backgroundColor: "#111827",
                          boxShadow: "0 12px 22px rgba(15, 23, 42, 0.18)",
                          transform: "translateY(-1px)",
                        },
                        "&:focus-visible": {
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.35)",
                        },
                      }}
                    >
                      View GitHub
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </section>
      </Container>
    </div>
  );
};

const summaryPillStyles = {
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  minWidth: 180,
  borderRadius: 999,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "rgba(255,255,255,0.7)",
  px: 2,
  py: 1.25,
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
} as const;

const summaryValueStyles = {
  fontSize: "1.1rem",
  fontWeight: 900,
  lineHeight: 1.1,
} as const;

const summaryLabelStyles = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: 0.9,
  color: "text.secondary",
  fontWeight: 700,
} as const;

export default ContributorsPage;
