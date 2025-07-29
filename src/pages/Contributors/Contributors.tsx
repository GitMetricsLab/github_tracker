import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Button,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Checkbox,
  Pagination,
} from "@mui/material";
import { FaGithub } from "react-icons/fa";
import axios from "axios";

const REPO_OWNER = "mehul-m-prajapati";
const REPO_NAME = "github_tracker";
const REPO_FULL = `${REPO_OWNER}/${REPO_NAME}`;

const PERIOD_OPTIONS = ["7d", "14d", "30d", "90d"];

const ContributorsPage = () => {
  // Summary stats
  const [repoStats, setRepoStats] = useState(null);
  const [prStats, setPrStats] = useState({ opened: 0, merged: 0, velocity: "-" });
  const [issueStats, setIssueStats] = useState({ opened: 0, closed: 0, velocity: "-" });
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);

  // Fetch repo stats, PRs, issues, contributors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Repo stats (stars, forks, open issues)
        const repoRes = await axios.get(`https://api.github.com/repos/${REPO_FULL}`);
        setRepoStats(repoRes.data);

        // Contributors
        const contribRes = await axios.get(`https://api.github.com/repos/${REPO_FULL}/contributors?per_page=100`);
        setContributors(contribRes.data);

        // PRs (all states)
        const prRes = await axios.get(`https://api.github.com/repos/${REPO_FULL}/pulls?state=all&per_page=100`);
        const prs = prRes.data;
        const opened = prs.length;
        const merged = prs.filter(pr => pr.merged_at).length;
        // Calculate PR velocity (mock: 1d if any, else '-')
        const velocity = opened > 0 ? "1d" : "-";
        setPrStats({ opened, merged, velocity });

        // Issues (all states, filter out PRs)
        const issueRes = await axios.get(`https://api.github.com/repos/${REPO_FULL}/issues?state=all&per_page=100`);
        const issues = issueRes.data.filter(issue => !issue.pull_request);
        const openedIssues = issues.length;
        const closedIssues = issues.filter(issue => issue.state === "closed").length;
        // Calculate Issue velocity (mock: 5d if any, else '-')
        const issueVelocity = openedIssues > 0 ? "5d" : "-";
        setIssueStats({ opened: openedIssues, closed: closedIssues, velocity: issueVelocity });
      } catch (err) {
        setRepoStats(null);
        setContributors([]);
        setPrStats({ opened: 0, merged: 0, velocity: "-" });
        setIssueStats({ opened: 0, closed: 0, velocity: "-" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  // Pagination logic
  const paginatedContributors = contributors.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(contributors.length / perPage);

  // Helper for activity (mock: based on contributions)
  const getActivity = (contrib) => {
    if (contrib.contributions > 50) return {
      label: "High",
      color: "#22c55e",
      bg: "linear-gradient(90deg, #bbf7d0 0%, #d1fae5 100%)",
      icon: (
        <svg viewBox="-9.84 -9.84 43.68 43.68" width="18" height="18" style={{ marginRight: 6 }} xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#4eb75a" strokeMiterlimit="10" strokeWidth="1.91" points="1.5 18.68 9.14 11.04 12.96 14.86 22.5 5.32"/><polyline fill="none" stroke="#4eb75a" strokeMiterlimit="10" strokeWidth="1.91" points="17.73 5.32 22.5 5.32 22.5 10.09"/></svg>
      )
    };
    if (contrib.contributions > 10) return {
      label: "Medium",
      color: "#eab308",
      bg: "linear-gradient(90deg, #fde68a 0%, #fef9c3 100%)",
      icon: "— "
    };
    return {
      label: "Low",
      color: "#ef4444",
      bg: "linear-gradient(90deg, #fecaca 0%, #fee2e2 100%)",
      icon: (
        <svg width="18" height="18" viewBox="-9.84 -9.84 43.68 43.68" style={{ marginRight: 6 }} xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#c84141" strokeMiterlimit="10" strokeWidth="1.91" points="1.5 5.32 9.14 12.96 12.96 9.14 22.5 18.68"/><polyline fill="none" stroke="#c84141" strokeMiterlimit="10" strokeWidth="1.91" points="17.73 18.68 22.5 18.68 22.5 13.91"/></svg>
      )
    };
  };

  // Helper for PR overview (mock: random %)
  const getPROverview = (contrib) => {
    const prs = contrib.contributions;
    // For demo, percent is capped at 100
    const percent = Math.min(100, Math.round((prs / 132) * 100)); // 132 is max in demo
    return { prs, percent };
  };

  // Helper for PR velocity (mock: random)
  const getPRVelocity = () => ({ velocity: "1d", percent: 55 });

  // Helper for contributors avatars (mock: show avatar)
  const getContributorsAvatars = (contrib) => [contrib.avatar_url];

  // Helper for last 30 days (mock: SVG line)
  const ActivityGraph = () => (
    <svg width="80" height="24">
      <polyline
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        points="0,20 10,10 20,15 30,5 40,10 50,8 60,12 70,6 80,14"
      />
    </svg>
  );

  return (
    <Box sx={{ background: "#fff", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Github-Tracker Workspace
        </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Button variant="contained" color="warning" sx={{ fontWeight: 600, borderRadius: 2 }}>
              Add repositories
            </Button> */}
            <Select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              size="small"
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              {PERIOD_OPTIONS.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            <Button variant="outlined" sx={{ fontWeight: 600, borderRadius: 2 }}>
              Filter
            </Button>
          </Box>
        </Box>
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* PRs */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {/* PR Icon in box */}
                  <Box sx={{ background: '#f3f4f6', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7V17" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/><path d="M17 7V17" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/><circle cx="7" cy="5" r="2" fill="#64748b"/><circle cx="7" cy="19" r="2" fill="#64748b"/><circle cx="17" cy="5" r="2" fill="#64748b"/><circle cx="17" cy="19" r="2" fill="#64748b"/></svg>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Pull Requests</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 5, justifyContent: 'space-between', mt: 1 }}>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Opened <span style={{color:'#22c55e',fontSize:12,marginLeft:2}}>&#9679;</span></Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{prStats.opened}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Merged <span style={{color:'#a21caf',fontSize:12,marginLeft:2}}>&#9679;</span></Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{prStats.merged}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Velocity</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{prStats.velocity}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Issues */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {/* Issue Icon in box */}
                  <Box sx={{ background: '#f3f4f6', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#64748b" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="#64748b"/></svg>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Issues</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 5, justifyContent: 'space-between', mt: 1 }}>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Opened <span style={{color:'#22c55e',fontSize:12,marginLeft:2}}>&#9679;</span></Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{issueStats.opened}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Closed <span style={{color:'#a21caf',fontSize:12,marginLeft:2}}>&#9679;</span></Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{issueStats.closed}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Velocity</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{issueStats.velocity}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Engagement */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {/* Heart Icon in box */}
                  <Box sx={{ background: '#f3f4f6', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6.5-4.35-9.5-8.5C-1.5 7.5 4.5 2.5 12 8.5c7.5-6 13.5-1 9.5 4C18.5 16.65 12 21 12 21z" stroke="#64748b" strokeWidth="2" fill="none"/></svg>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Engagement</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 5, justifyContent: 'space-between', mt: 1 }}>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Stars</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{repoStats ? repoStats.stargazers_count : 0}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Forks</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{repoStats ? repoStats.forks_count : 0}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 90 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>Activity Ratio</Typography>
                    {/* Activity Ratio pill */}
                    <Box sx={{display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 600, fontSize: 14, background: 'linear-gradient(90deg, #fecaca 0%, #fee2e2 100%)', color: '#ef4444', minWidth: 60, justifyContent: 'center', boxShadow: 'none', border: 'none', letterSpacing: 0.2,}}>
                      <svg width="18" height="18" viewBox="-9.84 -9.84 43.68 43.68" style={{ marginRight: 6 }} xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#c84141" strokeMiterlimit="10" strokeWidth="1.91" points="1.5 5.32 9.14 12.96 12.96 9.14 22.5 18.68"/><polyline fill="none" stroke="#c84141" strokeMiterlimit="10" strokeWidth="1.91" points="17.73 18.68 22.5 18.68 22.5 13.91"/></svg>
                      Low
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Repositories Table */}
        <Paper sx={{ borderRadius: 3, boxShadow: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>REPOSITORY</TableCell>
                  <TableCell>ACTIVITY</TableCell>
                  <TableCell>PR OVERVIEW</TableCell>
                  <TableCell>PR VELOCITY</TableCell>
                  <TableCell>SPAM</TableCell>
                  <TableCell>CONTRIBUTORS</TableCell>
                  <TableCell>LAST 30 DAYS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedContributors.map((contrib, idx) => {
                    const activity = getActivity(contrib);
                    const prOverview = getPROverview(contrib);
                    const prVelocity = getPRVelocity();
                    const avatars = getContributorsAvatars(contrib);
                    return (
                      <TableRow key={contrib.id}>
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar src="/public/crl.png" sx={{ width: 32, height: 32 }} />
                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>{contrib.login}</Typography>
                              <Typography variant="caption" color="text.secondary">@{REPO_OWNER}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {/* Activity pill */}
                          <Box
                            sx={{display: "inline-flex",alignItems: "center",px: 1.5,py: 0.5,borderRadius: 2,fontWeight: 600,fontSize: 14,background: activity.bg,color: activity.color,minWidth: 80,justifyContent: 'center',boxShadow: 'none',border: 'none',letterSpacing: 0.2,}}
                          >
                            {activity.icon}
                            {activity.label}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{prOverview.prs} PRs</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                              {/* Green base bar */}
                              <Box sx={{width: 60,height: 8,borderRadius: 4,background: '#22c55e',position: 'relative',overflow: 'hidden', }}>
                                {/* Purple overlay bar */}
                                <Box sx={{position: 'absolute',left: 0,top: 0,height: '100%',width: `${prOverview.percent}%`,background: '#a21caf',borderRadius: 4,transition: 'width 0.3s',}} />
                              </Box>
                              <Typography variant="caption" sx={{ color: '#a21caf', fontWeight: 600 }}>{prOverview.percent}%</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{prVelocity.velocity}</Typography>
                            <Typography variant="caption" color="text.secondary">{prVelocity.percent}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>-</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {avatars.map((url, i) => (
                              <Avatar key={i} src={url} sx={{ width: 24, height: 24, ml: i === 0 ? 0 : -1 }} />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <ActivityGraph />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="body2">
              Showing {paginatedContributors.length > 0 ? (page - 1) * perPage + 1 : 0} - {Math.min(page * perPage, contributors.length)} of {contributors.length} repos
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContributorsPage;
