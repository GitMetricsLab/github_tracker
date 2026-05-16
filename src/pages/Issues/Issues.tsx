import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Link,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IssueOpenedIcon, IssueClosedIcon } from "@primer/octicons-react";

const ROWS_PER_PAGE = 10;

interface IssueItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  repository_url: string;
  html_url: string;
}

const Issues: React.FC = () => {
  const theme = useTheme();

  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [totalIssues, setTotalIssues] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const [language, setLanguage] = useState("");
  const [tag, setTag] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchIssues = useCallback(async (currentPage: number, currentLanguage: string, currentTag: string, currentOrder: string) => {
    setLoading(true);
    setError("");

    try {
      let q = "is:issue is:open";
      if (currentLanguage) {
        q += ` language:${currentLanguage}`;
      }
      if (currentTag) {
        q += ` label:"${currentTag}"`;
      }

      const response = await fetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=created&order=${currentOrder}&per_page=${ROWS_PER_PAGE}&page=${currentPage + 1}`
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("GitHub API rate limit exceeded.");
        }
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setIssues(data.items);
      setTotalIssues(data.total_count > 1000 ? 1000 : data.total_count); // GitHub limits search results to 1000
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch issues");
      } else {
        setError("Failed to fetch issues");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues(page, language, tag, sortOrder);
  }, [page, language, tag, sortOrder, fetchIssues]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: "80vh", color: theme.palette.text.primary }}>
      <Typography variant="h4" gutterBottom>
        Explore GitHub Issues
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 4, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e: SelectChangeEvent) => {
                setLanguage(e.target.value as string);
                setPage(0);
              }}
            >
              <MenuItem value="">All Languages</MenuItem>
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="typescript">TypeScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="c++">C++</MenuItem>
              <MenuItem value="go">Go</MenuItem>
              <MenuItem value="ruby">Ruby</MenuItem>
              <MenuItem value="php">PHP</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>Tags / Labels</InputLabel>
            <Select
              value={tag}
              label="Tags / Labels"
              onChange={(e: SelectChangeEvent) => {
                setTag(e.target.value as string);
                setPage(0);
              }}
            >
              <MenuItem value="">All Tags</MenuItem>
              <MenuItem value="good first issue">Good First Issue</MenuItem>
              <MenuItem value="bug">Bug</MenuItem>
              <MenuItem value="enhancement">Enhancement</MenuItem>
              <MenuItem value="help wanted">Help Wanted</MenuItem>
              <MenuItem value="documentation">Documentation</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel>Sort by Time</InputLabel>
            <Select
              value={sortOrder}
              label="Sort by Time"
              onChange={(e: SelectChangeEvent) => {
                setSortOrder(e.target.value as string);
                setPage(0);
              }}
            >
              <MenuItem value="desc">Newest</MenuItem>
              <MenuItem value="asc">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowY: "auto" }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="center">Repository</TableCell>
                  <TableCell align="center">State</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.state === "closed" ? (
                        <IssueClosedIcon size={16} className="icon-issue-closed" />
                      ) : (
                        <IssueOpenedIcon size={16} className="icon-issue-open" />
                      )}
                      <Link
                        href={item.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      {item.repository_url.split("/").slice(-2).join("/")}
                    </TableCell>
                    <TableCell align="center">{item.state}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                  </TableRow>
                ))}
                {issues.length === 0 && !loading && !error && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No issues found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalIssues}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={ROWS_PER_PAGE}
              rowsPerPageOptions={[ROWS_PER_PAGE]}
            />
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default Issues;
