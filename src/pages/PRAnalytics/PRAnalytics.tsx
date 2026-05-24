import React, { useState, useMemo } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  GitPullRequestIcon,
  GitMergeIcon,
  GitPullRequestClosedIcon,
  CheckIcon,
  AlertIcon,
  ClockIcon,
} from '@primer/octicons-react';
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ShieldCheck, ShieldAlert, Users } from "lucide-react";

interface PRDetail {
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  timeToFirstReview: number | null; // in ms
  reviewCompletionDuration: number | null; // in ms
  turnaroundTime: number | null; // in ms
  stalled: boolean;
  reviewers: string[];
}

interface ReviewerWorkload {
  username: string;
  reviewsCount: number;
}

const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"];

const PRAnalytics: React.FC = () => {
  const theme = useTheme();
  const { username, getOctokit } = useGitHubAuth();

  const [repoInput, setRepoInput] = useState("GitMetricsLab/github_tracker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prDetailsList, setPrDetailsList] = useState<PRDetail[]>([]);

  const handleFetchAnalytics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.includes("/")) {
      setError("Please specify repo in owner/repo format.");
      return;
    }

    const octokit = getOctokit();
    if (!octokit) {
      setError("GitHub credentials missing. Please log in using the inputs in the Tracker tab first.");
      return;
    }

    const [owner, repo] = repoInput.split("/");
    setLoading(true);
    setError("");
    setPrDetailsList([]);

    try {
      // 1. Fetch recent PRs (both open and closed)
      const prsResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner,
        repo,
        state: "all",
        per_page: 20,
      });

      const prs = prsResponse.data;

      if (!prs || prs.length === 0) {
        setError("No Pull Requests found in this repository.");
        setLoading(false);
        return;
      }

      // 2. Fetch reviews in parallel for all fetched PRs
      const details: PRDetail[] = await Promise.all(
        prs.map(async (pr: any) => {
          let reviews: any[] = [];
          try {
            const reviewsResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
              owner,
              repo,
              pull_number: pr.number,
            });
            reviews = reviewsResponse.data;
          } catch (reviewErr) {
            console.warn(`Failed to fetch reviews for PR #${pr.number}`, reviewErr);
          }

          const createdTime = new Date(pr.created_at).getTime();
          const closedTime = pr.closed_at ? new Date(pr.closed_at).getTime() : null;
          const mergedTime = pr.merged_at ? new Date(pr.merged_at).getTime() : null;

          // Find first review
          const submittedReviews = reviews
            .filter((r: any) => r.submitted_at)
            .sort((a: any, b: any) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());

          let timeToFirstReview: number | null = null;
          let reviewCompletionDuration: number | null = null;

          if (submittedReviews.length > 0) {
            const firstReviewTime = new Date(submittedReviews[0].submitted_at).getTime();
            timeToFirstReview = firstReviewTime - createdTime;

            if (mergedTime || closedTime) {
              const finalTime = mergedTime || closedTime || 0;
              reviewCompletionDuration = finalTime - firstReviewTime;
            }
          }

          let turnaroundTime: number | null = null;
          if (mergedTime) {
            turnaroundTime = mergedTime - createdTime;
          }

          // Check if stalled (open for > 14 days with no reviews/comments in the last 7 days)
          const now = Date.now();
          const openDuration = now - createdTime;
          const isStalled =
            pr.state === "open" &&
            openDuration > 14 * 24 * 60 * 60 * 1000 &&
            (submittedReviews.length === 0 ||
              now - new Date(submittedReviews[submittedReviews.length - 1].submitted_at).getTime() > 7 * 24 * 60 * 60 * 1000);

          const reviewers = Array.from(new Set(reviews.map((r: any) => r.user?.login).filter(Boolean))) as string[];

          return {
            number: pr.number,
            title: pr.title,
            state: pr.state,
            htmlUrl: pr.html_url,
            createdAt: pr.created_at,
            mergedAt: pr.merged_at,
            closedAt: pr.closed_at,
            timeToFirstReview,
            reviewCompletionDuration,
            turnaroundTime,
            stalled: isStalled,
            reviewers,
          };
        })
      );

      setPrDetailsList(details);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch repository pull requests. Check your credentials and repo name.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Compute Metrics
  const calculatedMetrics = useMemo(() => {
    if (prDetailsList.length === 0) return null;

    let totalTimeToFirstReview = 0;
    let countTimeToFirstReview = 0;

    let totalReviewCompletion = 0;
    let countReviewCompletion = 0;

    let totalTurnaround = 0;
    let countTurnaround = 0;

    let stalledCount = 0;
    let unreviewedCount = 0;

    const reviewerCounts: { [key: string]: number } = {};

    prDetailsList.forEach((pr) => {
      if (pr.timeToFirstReview !== null) {
        totalTimeToFirstReview += pr.timeToFirstReview;
        countTimeToFirstReview++;
      } else {
        unreviewedCount++;
      }

      if (pr.reviewCompletionDuration !== null) {
        totalReviewCompletion += pr.reviewCompletionDuration;
        countReviewCompletion++;
      }

      if (pr.turnaroundTime !== null) {
        totalTurnaround += pr.turnaroundTime;
        countTurnaround++;
      }

      if (pr.stalled) stalledCount++;

      pr.reviewers.forEach((rev) => {
        reviewerCounts[rev] = (reviewerCounts[rev] || 0) + 1;
      });
    });

    const avgTimeToFirstReview = countTimeToFirstReview > 0 ? totalTimeToFirstReview / countTimeToFirstReview : null;
    const avgReviewCompletion = countReviewCompletion > 0 ? totalReviewCompletion / countReviewCompletion : null;
    const avgTurnaround = countTurnaround > 0 ? totalTurnaround / countTurnaround : null;

    // Workload Array
    const workloadList: ReviewerWorkload[] = Object.entries(reviewerCounts)
      .map(([username, count]) => ({ username, reviewsCount: count }))
      .sort((a, b) => b.reviewsCount - a.reviewsCount);

    // Health Score calculation
    let healthScore = 100;
    if (prDetailsList.length > 0) {
      // Unreviewed penalty: up to -30
      const unreviewedRatio = unreviewedCount / prDetailsList.length;
      healthScore -= unreviewedRatio * 30;

      // Avg first review latency penalty: up to -25
      if (avgTimeToFirstReview) {
        const hours = avgTimeToFirstReview / (3600 * 1000);
        if (hours > 12) {
          healthScore -= Math.min(25, (hours - 12) * 1.5);
        }
      }

      // Turnaround speed penalty: up to -25
      if (avgTurnaround) {
        const days = avgTurnaround / (24 * 3600 * 1000);
        if (days > 3) {
          healthScore -= Math.min(25, (days - 3) * 3);
        }
      }

      // Stalled PR penalty: up to -20
      if (stalledCount > 0) {
        healthScore -= Math.min(20, stalledCount * 5);
      }
    }
    healthScore = Math.max(0, Math.round(healthScore));

    // Bottlenecks
    const overloadedReviewers = workloadList.filter(
      (w) => w.reviewsCount > 3 || (w.reviewsCount / prDetailsList.length) > 0.4
    );

    const delayedReviews = prDetailsList.filter(
      (pr) => pr.state === "open" && pr.timeToFirstReview === null && (Date.now() - new Date(pr.createdAt).getTime()) > 48 * 3600 * 1000
    );

    return {
      avgTimeToFirstReview,
      avgReviewCompletion,
      avgTurnaround,
      stalledCount,
      unreviewedCount,
      workloadList,
      healthScore,
      overloadedReviewers,
      delayedReviews,
    };
  }, [prDetailsList]);

  // Chart preparation
  const chartData = useMemo(() => {
    if (!calculatedMetrics) return null;

    // Workload Chart data
    const workloadData = calculatedMetrics.workloadList.map((item) => ({
      name: item.username,
      value: item.reviewsCount,
    }));

    // Lifecycle counts
    let openCount = 0;
    let closedCount = 0;
    let mergedCount = 0;

    prDetailsList.forEach((pr) => {
      if (pr.mergedAt) mergedCount++;
      else if (pr.state === "open") openCount++;
      else closedCount++;
    });

    const lifecycleData = [
      { name: "Merged", value: mergedCount },
      { name: "Open", value: openCount },
      { name: "Closed", value: closedCount },
    ];

    // Trends Data
    const trendData = prDetailsList
      .filter((pr) => pr.timeToFirstReview !== null)
      .slice(-10) // last 10 reviewed
      .map((pr) => ({
        prNumber: `#${pr.number}`,
        firstReviewHrs: Math.round((pr.timeToFirstReview || 0) / (3600 * 1000) * 10) / 10,
        turnaroundDays: pr.turnaroundTime ? Math.round(pr.turnaroundTime / (24 * 3600 * 1000) * 10) / 10 : 0,
      }));

    return {
      workloadData,
      lifecycleData,
      trendData,
    };
  }, [prDetailsList, calculatedMetrics]);

  const formatDurationMs = (ms: number | null) => {
    if (ms === null) return "N/A";
    const sec = ms / 1000;
    const min = sec / 60;
    const hr = min / 60;
    const day = hr / 24;

    if (day >= 1) return `${Math.round(day * 10) / 10}d`;
    if (hr >= 1) return `${Math.round(hr * 10) / 10}h`;
    if (min >= 1) return `${Math.round(min * 10) / 10}m`;
    return `${Math.round(sec)}s`;
  };

  const getHealthLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-500", icon: ShieldCheck };
    if (score >= 60) return { label: "Good", color: "text-blue-500", icon: ShieldCheck };
    if (score >= 40) return { label: "Fair", color: "text-yellow-500", icon: ShieldAlert };
    return { label: "Poor", color: "text-red-500", icon: ShieldAlert };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6, color: theme.palette.text.primary }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          PR Review Intelligence & Bottlenecks
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          Track repository workflow latency, time to first review, reviewer capacity, and blocked workflows.
        </Typography>

        <form onSubmit={handleFetchAnalytics}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Repository (owner/repo)"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              required
              sx={{ flex: 1, minWidth: 250 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: "150px", minHeight: "55px" }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch Analytics"}
            </Button>
          </Box>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" flexDirection="column" alignItems="center" my={6} gap={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Analyzing pull requests and review histories...
          </Typography>
        </Box>
      )}

      {calculatedMetrics && chartData && !loading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Top Metric Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Time to First Review
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                    {formatDurationMs(calculatedMetrics.avgTimeToFirstReview)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Average delay to first action
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Review Completion Speed
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                    {formatDurationMs(calculatedMetrics.avgReviewCompletion)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Average review iteration speed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Avg Turnaround Time
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                    {formatDurationMs(calculatedMetrics.avgTurnaround)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Average time to merge
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Health Score Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Repository Health Score
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {calculatedMetrics.healthScore}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      /100
                    </Typography>
                  </Box>
                  {(() => {
                    const health = getHealthLevel(calculatedMetrics.healthScore);
                    const HealthIcon = health.icon;
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }} className={health.color}>
                        <HealthIcon className="h-4 w-4" />
                        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                          {health.label} Workflow
                        </Typography>
                      </Box>
                    );
                  })()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Review Workload Distribution
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Total review assignments per contributor
                  </Typography>
                  <Box sx={{ height: 260, mt: 2 }}>
                    {chartData.workloadData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.workloadData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={(entry) => entry.name}
                          >
                            {chartData.workloadData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No reviews found on recent PRs.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Recent Response Times Trend
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    First Review (hrs) & Merge (days) per Pull Request
                  </Typography>
                  <Box sx={{ height: 260, mt: 2 }}>
                    {chartData.trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" />
                          <XAxis dataKey="prNumber" stroke={theme.palette.text.secondary} />
                          <YAxis stroke={theme.palette.text.secondary} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="firstReviewHrs" fill="#3B82F6" name="First Review (hrs)" />
                          <Bar dataKey="turnaroundDays" fill="#10B981" name="Merge Time (days)" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Trend data requires PRs with submitted reviews.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Collaboration Bottlenecks and Overload */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                    <Users className="h-5 w-5 text-orange-500" />
                    Reviewer Capacity & Overload
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reviewers carrying a disproportionate share of workload
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />

                  {calculatedMetrics.overloadedReviewers.length > 0 ? (
                    <List dense>
                      {calculatedMetrics.overloadedReviewers.map((rev) => (
                        <ListItem key={rev.username}>
                          <ListItemIcon>
                            <AlertIcon size={16} className="text-red-500" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<strong>@{rev.username}</strong>}
                            secondary={`${rev.reviewsCount} reviews on recent PRs (High overload risk)`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <CheckIcon size={24} className="text-green-500" />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Reviewer workload is well distributed!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                    <ClockIcon size={20} className="text-yellow-500" />
                    Delayed & Stalled PRs
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Workflows waiting for review or blocked for too long
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />

                  {calculatedMetrics.delayedReviews.length > 0 || calculatedMetrics.stalledCount > 0 ? (
                    <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                      {calculatedMetrics.delayedReviews.map((pr) => (
                        <ListItem key={pr.number}>
                          <ListItemIcon>
                            <ClockIcon size={16} className="text-yellow-500" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
                                PR #{pr.number} - {pr.title}
                              </Link>
                            }
                            secondary="Waiting for review for more than 48 hours"
                          />
                        </ListItem>
                      ))}

                      {prDetailsList
                        .filter((pr) => pr.stalled)
                        .map((pr) => (
                          <ListItem key={pr.number}>
                            <ListItemIcon>
                              <AlertIcon size={16} className="text-red-500" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Link href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
                                  PR #{pr.number} - {pr.title}
                                </Link>
                              }
                              secondary="Stalled: Open > 14 days with no recent review updates"
                            />
                          </ListItem>
                        ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <CheckIcon size={24} className="text-green-500" />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        No stalled or delayed PRs detected!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Pull Request Analytics Table */}
          <Card sx={{ backgroundColor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Pull Request Lifecycle Log
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300, overflowY: "auto" }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>PR</TableCell>
                      <TableCell align="center">State</TableCell>
                      <TableCell align="center">Time to 1st Review</TableCell>
                      <TableCell align="center">Review Duration</TableCell>
                      <TableCell align="center">Turnaround Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prDetailsList.map((pr) => (
                      <TableRow key={pr.number}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {pr.mergedAt ? (
                              <GitMergeIcon size={16} className="text-purple-500" />
                            ) : pr.state === "open" ? (
                              <GitPullRequestIcon size={16} className="text-green-500" />
                            ) : (
                              <GitPullRequestClosedIcon size={16} className="text-red-500" />
                            )}
                            <Link href={pr.htmlUrl} target="_blank" rel="noopener noreferrer" underline="hover">
                              #{pr.number} - {pr.title}
                            </Link>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {pr.mergedAt ? "merged" : pr.state}
                        </TableCell>
                        <TableCell align="center">
                          {formatDurationMs(pr.timeToFirstReview)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDurationMs(pr.reviewCompletionDuration)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDurationMs(pr.turnaroundTime)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default PRAnalytics;
