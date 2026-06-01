/**
 * Tracker.tsx — Improved UI/UX
 * Changes from original (minimal):
 *  + Added RepoIcon, RepoForkedIcon, StarIcon, LockIcon imports
 *  + Added BookOpen, GitFork, Star imports from lucide-react
 *  + Added useGitHubRepos hook
 *  + Added GitHubRepo type import
 *  + Added REPOS_PER_PAGE constant
 *  + Added LANG_COLORS, timeAgo, fmtNum helpers
 *  + Added RepoCard component
 *  + Added ReposSection component
 *  + tab type extended to include "repos"
 *  + Added repoPage state
 *  + Added useEffect for repo tab pagination
 *  + handleSubmit now also calls fetchRepos
 *  + Added 2 new stat cards (Repositories, Total Stars)
 *  + Tab list now includes Repositories tab
 *  + ReposSection rendered when tab === "repos"
 *  Everything else is IDENTICAL to your original code
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { GitHubRepo } from "../../hooks/useGitHubRepos";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitMergeIcon,
  RepoIcon,
  RepoForkedIcon,
  StarIcon,
  LockIcon,
} from "@primer/octicons-react";
import { useTheme } from "@mui/material/styles";
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
  TableSortLabel,
  Link,
  Alert,
  Skeleton,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
  TextField,
} from "@mui/material";
import {
  Search,
  Key,
  SlidersHorizontal,
  Download,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  GitPullRequest,
  CircleDot,
  XCircle,
  CheckCircle2,
  BookOpen,
  GitFork,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGitHubAuth } from "../../hooks/useGitHubAuth";
import { useGitHubData } from "../../hooks/useGitHubData";
import { useGitHubRepos } from "../../hooks/useGitHubRepos";

// ─── types ────────────────────────────────────────────────────────────────────

interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
}

type SortKey = "title" | "repository_url" | "state" | "created_at";
type SortDir = "asc" | "desc";
type RepoSort = "pushed_at" | "stargazers_count" | "forks_count" | "name" | "open_issues_count";

// ─── constants ────────────────────────────────────────────────────────────────

const ROWS_PER_PAGE  = 10;
const REPOS_PER_PAGE = 12;

// Language colour map
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Java: "#b07219", "C++": "#f34b7d", C: "#555555", "C#": "#178600",
  Go: "#00ADD8", Rust: "#dea584", Ruby: "#701516", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", Shell: "#89e051",
  HTML: "#e34c26", CSS: "#563d7c", Dart: "#00B4AB", Scala: "#c22d40",
  R: "#198CE7", Vue: "#41b883", Svelte: "#ff3e00",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// NEW helper — relative time for repo cards
const timeAgo = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

// NEW helper — compact number format
const fmtNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const getRepoName = (url: string) => url.split("/").slice(-1)[0];

const getItemState = (item: GitHubItem): string => {
  if (item.pull_request?.merged_at) return "merged";
  return item.state;
};

function exportCSV(data: GitHubItem[], filename = "tracker-export.csv") {
  const header = ["Title", "Repository", "State", "Created", "URL"];
  const rows = data.map((item) => [
    `"${item.title.replace(/"/g, '""')}"`,
    getRepoName(item.repository_url),
    getItemState(item),
    formatDate(item.created_at),
    item.html_url,
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── StatCard — UNCHANGED ─────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = ({ label, value, icon, color, bg }) => (
  <Paper
    elevation={0}
    sx={{
      flex: "1 1 140px",
      minWidth: 120,
      p: 2,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
    role="status"
    aria-label={`${label}: ${value}`}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        bgcolor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Box sx={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.2 }}>
        {value.toLocaleString()}
      </Box>
      <Box sx={{ fontSize: "0.72rem", color: "text.secondary", mt: 0.25 }}>
        {label}
      </Box>
    </Box>
  </Paper>
);

// ─── SkeletonRow — UNCHANGED ──────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <TableRow>
    {[180, 100, 70, 90].map((w, i) => (
      <TableCell key={i}>
        <Skeleton variant="text" width={w} height={18} />
      </TableCell>
    ))}
  </TableRow>
);

// ─── StatusIcon — UNCHANGED (with aria-label fix) ────────────────────────────

const StatusIcon: React.FC<{ item: GitHubItem }> = ({ item }) => {
  if (item.pull_request) {
    if (item.pull_request.merged_at)
      return <span aria-label="Merged" role="img"><GitMergeIcon size={15} style={{ color: "#8250df" }} /></span>;
    if (item.state === "closed")
      return <span aria-label="PR closed" role="img"><GitPullRequestClosedIcon size={15} style={{ color: "#cf222e" }} /></span>;
    return <span aria-label="PR open" role="img"><GitPullRequestIcon size={15} style={{ color: "#1a7f37" }} /></span>;
  }
  if (item.state === "closed")
    return <span aria-label="Issue closed" role="img"><IssueClosedIcon size={15} style={{ color: "#8250df" }} /></span>;
  return <span aria-label="Issue open" role="img"><IssueOpenedIcon size={15} style={{ color: "#1a7f37" }} /></span>;
};

// ─── StateBadge — UNCHANGED ───────────────────────────────────────────────────

const StateBadge: React.FC<{ state: string }> = ({ state }) => {
  const map: Record<string, { color: "success" | "error" | "secondary" | "default"; label: string }> = {
    open:   { color: "success",   label: "Open"   },
    closed: { color: "error",     label: "Closed" },
    merged: { color: "secondary", label: "Merged" },
  };
  const cfg = map[state] ?? { color: "default", label: state };
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      sx={{ fontSize: "0.68rem", height: 20, borderRadius: 1 }}
    />
  );
};

// ─── EmptyState — UNCHANGED ───────────────────────────────────────────────────

const EmptyState: React.FC<{ searched: boolean }> = ({ searched }) => (
  <Box
    sx={{
      py: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1.5,
      color: "text.secondary",
    }}
    role="status"
    aria-label={searched ? "No results found" : "Enter a username to get started"}
  >
    <Box sx={{ opacity: 0.3, mb: 1 }}>
      <GitPullRequest size={52} strokeWidth={1} />
    </Box>
    <Box sx={{ fontWeight: 600, fontSize: "1rem", color: "text.primary" }}>
      {searched ? "No results match your filters" : "Track a GitHub user"}
    </Box>
    <Box sx={{ fontSize: "0.82rem", maxWidth: 340, textAlign: "center" }}>
      {searched
        ? "Try adjusting the filters or clearing the date range."
        : "Enter a GitHub username above and click Fetch Data to see their issues and pull requests."}
    </Box>
  </Box>
);

// ─── NEW: RepoCard ────────────────────────────────────────────────────────────

const RepoCard: React.FC<{ repo: GitHubRepo; borderCol: string }> = ({ repo, borderCol }) => {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "#8b949e") : null;

  return (
    <Paper elevation={0}
      sx={{
        p: 2.5, borderRadius: 3,
        border: `1px solid ${borderCol}`,
        display: "flex", flexDirection: "column", gap: 1.5,
        transition: "border-color .15s, box-shadow .15s",
        "&:hover": { borderColor: "primary.main", boxShadow: "0 2px 12px rgba(0,0,0,.08)" },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
          <Box sx={{ color: "text.secondary", flexShrink: 0, display: "flex" }}>
            {repo.fork ? <RepoForkedIcon size={16} /> : <RepoIcon size={16} />}
          </Box>
          <Link
            href={repo.html_url} target="_blank" rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontWeight: 700, fontSize: "0.9rem", color: "primary.main",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2, borderRadius: 0.5 },
            }}
            title={repo.full_name}
            aria-label={`${repo.name} — open on GitHub`}
          >
            {repo.name}
          </Link>
        </Box>
        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
          {repo.visibility === "private" && (
            <Tooltip title="Private repository">
              <Box sx={{ display: "flex", alignItems: "center" }}><LockIcon size={13} /></Box>
            </Tooltip>
          )}
          <Chip
            label={repo.fork ? "Fork" : repo.visibility}
            size="small" variant="outlined"
            sx={{ fontSize: "0.65rem", height: 18, borderRadius: 1, textTransform: "capitalize" }}
          />
        </Box>
      </Box>

      {/* Description */}
      <Box sx={{
        fontSize: "0.8rem", color: "text.secondary", lineHeight: 1.5,
        overflow: "hidden", display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: "2.4em",
      }}>
        {repo.description ?? (
          <Box component="span" sx={{ opacity: 0.4, fontStyle: "italic" }}>No description</Box>
        )}
      </Box>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {repo.topics.slice(0, 4).map((t) => (
            <Chip key={t} label={t} size="small"
              sx={{ fontSize: "0.62rem", height: 18, borderRadius: 1, bgcolor: "rgba(9,105,218,.08)", color: "primary.main", border: "1px solid rgba(9,105,218,.2)" }} />
          ))}
          {repo.topics.length > 4 && (
            <Chip label={`+${repo.topics.length - 4}`} size="small" variant="outlined"
              sx={{ fontSize: "0.62rem", height: 18, borderRadius: 1 }} />
          )}
        </Box>
      )}

      {/* Footer stats */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "auto", flexWrap: "wrap" }}>
        {repo.language && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
            <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: langColor ?? "#8b949e", flexShrink: 0 }} />
            {repo.language}
          </Box>
        )}
        <Tooltip title="Stars">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: "0.75rem", color: "text.secondary", cursor: "default" }}
            aria-label={`${repo.stargazers_count} stars`}>
            <StarIcon size={13} /> {fmtNum(repo.stargazers_count)}
          </Box>
        </Tooltip>
        <Tooltip title="Forks">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: "0.75rem", color: "text.secondary", cursor: "default" }}
            aria-label={`${repo.forks_count} forks`}>
            <RepoForkedIcon size={13} /> {fmtNum(repo.forks_count)}
          </Box>
        </Tooltip>
        {repo.open_issues_count > 0 && (
          <Tooltip title="Open issues">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: "0.75rem", color: "text.secondary", cursor: "default" }}
              aria-label={`${repo.open_issues_count} open issues`}>
              <IssueOpenedIcon size={13} /> {fmtNum(repo.open_issues_count)}
            </Box>
          </Tooltip>
        )}
        {repo.license && (
          <Box sx={{ fontSize: "0.7rem", color: "text.secondary" }}>{repo.license.name}</Box>
        )}
        <Box sx={{ ml: "auto", fontSize: "0.7rem", color: "text.secondary", whiteSpace: "nowrap" }}>
          Updated {timeAgo(repo.pushed_at)}
        </Box>
      </Box>
    </Paper>
  );
};

// ─── NEW: ReposSection ────────────────────────────────────────────────────────

const ReposSection: React.FC<{
  repos: GitHubRepo[];
  totalRepos: number;
  loading: boolean;
  error: string;
  page: number;
  onPageChange: (page: number) => void;
  borderCol: string;
}> = ({ repos, totalRepos, loading, error, page, onPageChange, borderCol }) => {

  const [search,     setSearch]     = useState("");
  const [langFilter, setLangFilter] = useState("All");
  const [sort,       setSort]       = useState<RepoSort>("pushed_at");
  const [sortDir,    setSortDir]    = useState<SortDir>("desc");
  const [showForks,  setShowForks]  = useState(true);

  const languages = [
    "All",
    ...Array.from(new Set(repos.map((r) => r.language).filter((l): l is string => l !== null))),
  ];

  const sortOptions: { key: RepoSort; label: string }[] = [
    { key: "pushed_at",         label: "Last updated" },
    { key: "stargazers_count",  label: "Stars"        },
    { key: "forks_count",       label: "Forks"        },
    { key: "open_issues_count", label: "Open issues"  },
    { key: "name",              label: "Name"         },
  ];

  const filtered = repos
    .filter((r) => {
      if (!showForks && r.fork) return false;
      if (langFilter !== "All" && r.language !== langFilter) return false;
      if (search &&
          !r.name.toLowerCase().includes(search.toLowerCase()) &&
          !(r.description ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const av = (a as any)[sort] ?? 0;
      const bv = (b as any)[sort] ?? 0;
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  return (
    <Box>
      {/* Mini stat row */}
      {!loading && repos.length > 0 && (
        <Box sx={{ display: "flex", gap: 3, mb: 2.5, flexWrap: "wrap" }}>
          {[
            { icon: <BookOpen size={14} />, label: `${totalRepos} repositories`        },
            { icon: <Star size={14} />,      label: `${fmtNum(totalStars)} stars total` },
            { icon: <GitFork size={14} />,   label: `${fmtNum(totalForks)} forks total` },
          ].map(({ icon, label }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.6, fontSize: "0.78rem", color: "text.secondary" }}>
              {icon} {label}
            </Box>
          ))}
        </Box>
      )}

      {/* Toolbar */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <Box sx={{
          display: "flex", alignItems: "center", flex: "1 1 200px",
          border: `1px solid ${borderCol}`, borderRadius: 2, px: 1.5, py: 0.6, gap: 1,
          "&:focus-within": { borderColor: "primary.main" },
        }}>
          <Search size={14} style={{ opacity: 0.5 }} aria-hidden="true" />
          <Box component="input" value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Find a repository…" aria-label="Search repositories"
            sx={{ border: "none", outline: "none", bgcolor: "transparent", color: "text.primary", fontSize: "0.82rem", flex: 1, "&::placeholder": { color: "text.disabled" } }}
          />
        </Box>

        {/* Language filter */}
        <Box component="select" value={langFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLangFilter(e.target.value)}
          aria-label="Filter by language"
          sx={{ border: `1px solid ${borderCol}`, borderRadius: 2, px: 1.5, py: 0.75, bgcolor: "transparent", color: "text.primary", fontSize: "0.8rem", cursor: "pointer", outline: "none", "&:focus": { borderColor: "primary.main" } }}>
          {languages.map((l) => <option key={l} value={l}>{l === "All" ? "Language" : l}</option>)}
        </Box>

        {/* Sort */}
        <Box component="select" value={sort}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as RepoSort)}
          aria-label="Sort repositories"
          sx={{ border: `1px solid ${borderCol}`, borderRadius: 2, px: 1.5, py: 0.75, bgcolor: "transparent", color: "text.primary", fontSize: "0.8rem", cursor: "pointer", outline: "none", "&:focus": { borderColor: "primary.main" } }}>
          {sortOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </Box>

        {/* Asc/Desc */}
        <Tooltip title={sortDir === "desc" ? "Descending" : "Ascending"}>
          <IconButton size="small" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
            aria-label="Toggle sort direction"
            sx={{ border: `1px solid ${borderCol}`, borderRadius: 2, px: 1.25, py: 0.75 }}>
            {sortDir === "desc" ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </IconButton>
        </Tooltip>

        {/* Hide forks */}
        <Chip
          label={showForks ? "Hide forks" : "Show forks"}
          size="small"
          variant={showForks ? "outlined" : "filled"}
          color={showForks ? "default" : "primary"}
          onClick={() => setShowForks((v) => !v)}
          aria-pressed={!showForks}
          sx={{ cursor: "pointer", fontSize: "0.72rem" }}
        />
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" icon={<AlertCircle size={16} />} sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Card grid */}
      {loading ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 2 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Paper key={i} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${borderCol}` }}>
              <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
              <Skeleton width="90%" height={16} />
              <Skeleton width="75%" height={16} sx={{ mb: 1.5 }} />
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Skeleton width={50} height={14} />
                <Skeleton width={40} height={14} />
                <Skeleton width={40} height={14} />
              </Box>
            </Paper>
          ))}
        </Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${borderCol}` }}>
          <Box sx={{ py: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }} role="status">
            <Box sx={{ opacity: 0.25, mb: 1 }}><RepoIcon size={52} /></Box>
            <Box sx={{ fontWeight: 600, fontSize: "1rem" }}>No repositories found</Box>
            <Box sx={{ fontSize: "0.82rem", color: "text.secondary" }}>Try adjusting your filters.</Box>
          </Box>
        </Paper>
      ) : (
        <>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 1.5 }}>
            Showing <strong>{filtered.length}</strong> of <strong>{repos.length}</strong> repositories on this page
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 2 }}>
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} borderCol={borderCol} />
            ))}
          </Box>
        </>
      )}

      {/* Pagination */}
      {!loading && totalRepos > REPOS_PER_PAGE && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, mt: 3 }}>
          <IconButton size="small" disabled={page === 0} onClick={() => onPageChange(page - 1)}
            aria-label="Previous page" sx={{ border: `1px solid ${borderCol}`, borderRadius: 2 }}>
            <ChevronUp size={15} style={{ transform: "rotate(-90deg)" }} />
          </IconButton>
          <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            Page {page + 1} of {Math.ceil(totalRepos / REPOS_PER_PAGE)}
          </Box>
          <IconButton size="small" disabled={(page + 1) * REPOS_PER_PAGE >= totalRepos}
            onClick={() => onPageChange(page + 1)} aria-label="Next page"
            sx={{ border: `1px solid ${borderCol}`, borderRadius: 2 }}>
            <ChevronDown size={15} style={{ transform: "rotate(-90deg)" }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

// ─── main component ───────────────────────────────────────────────────────────

const Tracker: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { username, setUsername, token, setToken, getOctokit } = useGitHubAuth();
  const { issues, prs, totalIssues, totalPrs, loading, error: dataError, fetchData } =
    useGitHubData(getOctokit);

  // NEW: repos hook
  const { repos, totalRepos, loading: reposLoading, error: reposError, fetchRepos } =
    useGitHubRepos(getOctokit);

  // tab now includes "repos"
  const [tab, setTab]               = useState<"issues" | "prs" | "repos">("issues");
  const [page, setPage]             = useState(0);
  const [repoPage, setRepoPage]     = useState(0); // NEW
  const [showFilters, setShowFilters] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [stateFilter, setStateFilter] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");

  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const prevFetched = useRef(false);

  // UNCHANGED: re-fetch issues/prs on tab or page change
  useEffect(() => {
    if (prevFetched.current && username && tab !== "repos") {
      fetchData(username, page + 1, ROWS_PER_PAGE);
    }
  }, [tab, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // NEW: re-fetch repos on repoPage change
  useEffect(() => {
    if (prevFetched.current && username && tab === "repos") {
      fetchRepos(username, repoPage + 1, REPOS_PER_PAGE);
    }
  }, [repoPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!username.trim()) return;
      setPage(0);
      setRepoPage(0); // NEW
      prevFetched.current = true;
      setHasFetched(true);
      // fetch both simultaneously
      const p1 = fetchData(username, 1, ROWS_PER_PAGE);
      const p2 = fetchRepos(username, 1, REPOS_PER_PAGE); // NEW
      toast.promise(
        Promise.all([p1 ?? Promise.resolve(), p2 ?? Promise.resolve()]),
        {
          loading: `Fetching data for @${username}…`,
          success: `Loaded activity for @${username}`,
          error:   "Fetch failed — check the error below",
        }
      );
    },
    [username, fetchData, fetchRepos]
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  // ── filter + sort pipeline — UNCHANGED ───────────────────────────────────

  const rawData = tab === "issues" ? issues : prs;

  const filtered = rawData
    .filter((item) => {
      if (stateFilter !== "all" && getItemState(item) !== stateFilter) return false;
      if (searchTitle && !item.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
      if (selectedRepo && !item.repository_url.includes(selectedRepo)) return false;
      if (startDate && new Date(item.created_at) < new Date(startDate)) return false;
      if (endDate   && new Date(item.created_at) > new Date(endDate))   return false;
      return true;
    })
    .sort((a, b) => {
      let av: string, bv: string;
      if (sortKey === "repository_url") { av = getRepoName(a.repository_url); bv = getRepoName(b.repository_url); }
      else if (sortKey === "state")     { av = getItemState(a); bv = getItemState(b); }
      else                              { av = (a as any)[sortKey] ?? ""; bv = (b as any)[sortKey] ?? ""; }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const totalCount   = tab === "issues" ? totalIssues : totalPrs;
  const openIssues   = issues.filter((i) => i.state === "open").length;
  const closedIssues = issues.filter((i) => i.state === "closed").length;
  const totalStars   = repos.reduce((s, r) => s + r.stargazers_count, 0); // NEW

  const stateOptions = tab === "prs"
    ? ["all", "open", "closed", "merged"]
    : ["all", "open", "closed"];

  const stateChipIcon: Record<string, React.ReactNode> = {
    all:    <CircleDot size={13} />,
    open:   <CheckCircle2 size={13} />,
    closed: <XCircle size={13} />,
    merged: <GitPullRequest size={13} />,
  };

  const surfaceBg = isDark ? "#161b22" : "#f6f8fa";
  const cardBg    = isDark ? "#0d1117"  : "#ffffff";
  const borderCol = isDark ? "#30363d"  : "#d0d7de";

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "80vh" }} component="main">

      {/* Page header — UNCHANGED */}
      <Box sx={{ mb: 3 }}>
        <Box component="h1" sx={{ fontSize: "1.5rem", fontWeight: 700, m: 0, mb: 0.5 }}>
          GitHub Activity Tracker
        </Box>
        <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
          Search issues and pull requests for any GitHub user
        </Box>
      </Box>

      {/* ── Search form — UNCHANGED ─────────────────────────────────────── */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${borderCol}`,
          bgcolor: cardBg,
        }}
      >
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" },
          gap: 2,
          alignItems: "flex-start",
        }}>

          {/* Username input */}
          <Box>
            <Box component="label" htmlFor="tracker-username"
              sx={{ fontSize: "0.78rem", fontWeight: 600, mb: 0.5, display: "block" }}>
              GitHub Username *
            </Box>
            <Box sx={{
              display: "flex", alignItems: "center",
              border: `1px solid ${borderCol}`, borderRadius: 2, overflow: "hidden",
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: `0 0 0 3px ${isDark ? "rgba(88,166,255,.25)" : "rgba(3,102,214,.15)"}`,
              },
            }}>
              <Box sx={{ px: 1.5, color: "text.secondary", display: "flex", alignItems: "center" }}>
                <Search size={16} aria-hidden="true" />
              </Box>
              <Box
                id="tracker-username"
                component="input"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="e.g. torvalds"
                required
                autoComplete="off"
                aria-required="true"
                aria-label="GitHub username"
                sx={{
                  flex: 1, border: "none", outline: "none",
                  bgcolor: "transparent", color: "text.primary",
                  fontSize: "0.875rem", py: 1.25, pr: 1.5,
                  "&::placeholder": { color: "text.disabled" },
                }}
              />
            </Box>
          </Box>

          {/* PAT input */}
          <Box>
            <Box component="label" htmlFor="tracker-pat"
              sx={{ fontSize: "0.78rem", fontWeight: 600, mb: 0.5, display: "block" }}>
              Personal Access Token{" "}
              <Tooltip title="Removes rate limits and allows private repo access. Never stored." arrow>
                <Box component="span" sx={{ cursor: "help", color: "text.secondary" }}>?</Box>
              </Tooltip>
            </Box>
            <Box sx={{
              display: "flex", alignItems: "center",
              border: `1px solid ${borderCol}`, borderRadius: 2, overflow: "hidden",
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: `0 0 0 3px ${isDark ? "rgba(88,166,255,.25)" : "rgba(3,102,214,.15)"}`,
              },
            }}>
              <Box sx={{ px: 1.5, color: "text.secondary", display: "flex", alignItems: "center" }}>
                <Key size={16} aria-hidden="true" />
              </Box>
              <Box
                id="tracker-pat"
                component="input"
                type="password"
                value={token}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxx"
                autoComplete="off"
                aria-label="GitHub Personal Access Token (optional)"
                sx={{
                  flex: 1, border: "none", outline: "none",
                  bgcolor: "transparent", color: "text.primary",
                  fontSize: "0.875rem", py: 1.25, pr: 1.5,
                  "&::placeholder": { color: "text.disabled" },
                }}
              />
            </Box>
            <Box sx={{ mt: 0.5, fontSize: "0.72rem", color: "text.secondary" }}>
              <Link href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" sx={{ fontSize: "0.72rem" }}>
                Generate token
              </Link>{" "}·{" "}
              <Link href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer" sx={{ fontSize: "0.72rem" }}>
                Learn more
              </Link>
            </Box>
          </Box>

          {/* Submit button */}
          <Box
            component="button"
            type="submit"
            disabled={loading || reposLoading || !username.trim()}
            aria-label="Fetch GitHub data"
            sx={{
              mt: { xs: 0, sm: "1.75rem" },
              px: 3, py: 1.375,
              border: "none", borderRadius: 2,
              cursor: loading || reposLoading || !username.trim() ? "not-allowed" : "pointer",
              bgcolor: loading || reposLoading || !username.trim() ? "action.disabledBackground" : "primary.main",
              color:   loading || reposLoading || !username.trim() ? "text.disabled" : "#fff",
              fontWeight: 600, fontSize: "0.875rem",
              transition: "background .15s, box-shadow .15s",
              whiteSpace: "nowrap",
              "&:hover:not(:disabled)": { bgcolor: "primary.dark", boxShadow: "0 2px 8px rgba(3,102,214,.35)" },
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: "2px" },
            }}
          >
            {loading || reposLoading ? "Fetching…" : "Fetch Data"}
          </Box>
        </Box>
      </Paper>

      {/* Error alerts — UNCHANGED + repos error added */}
      {dataError && (
        <Alert severity="error" icon={<AlertCircle size={18} />} sx={{ mb: 3, borderRadius: 2 }} role="alert">
          {dataError}
        </Alert>
      )}
      {reposError && (
        <Alert severity="error" icon={<AlertCircle size={18} />} sx={{ mb: 3, borderRadius: 2 }} role="alert">
          {reposError}
        </Alert>
      )}

      {/* ── Stat cards — original 4 UNCHANGED + 2 new ones ──────────────── */}
      {hasFetched && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }} aria-label="Summary statistics">
          <StatCard label="Total Issues"  value={totalIssues}  icon={<CircleDot size={18} />}      color={isDark ? "#79c0ff" : "#0969da"} bg={isDark ? "rgba(121,192,255,.12)" : "rgba(9,105,218,.08)"} />
          <StatCard label="Open Issues"   value={openIssues}   icon={<CheckCircle2 size={18} />}   color={isDark ? "#56d364" : "#1a7f37"} bg={isDark ? "rgba(86,211,100,.12)"  : "rgba(26,127,55,.08)"} />
          <StatCard label="Closed Issues" value={closedIssues} icon={<XCircle size={18} />}        color={isDark ? "#ff7b72" : "#cf222e"} bg={isDark ? "rgba(255,123,114,.12)" : "rgba(207,34,46,.08)"} />
          <StatCard label="Pull Requests" value={totalPrs}     icon={<GitPullRequest size={18} />} color={isDark ? "#d2a8ff" : "#8250df"} bg={isDark ? "rgba(210,168,255,.12)" : "rgba(130,80,223,.08)"} />
          {/* NEW */}
          <StatCard label="Repositories"  value={totalRepos}   icon={<BookOpen size={18} />}       color={isDark ? "#ffa657" : "#bc4c00"} bg={isDark ? "rgba(255,166,87,.12)"  : "rgba(188,76,0,.08)"}  />
          <StatCard label="Total Stars"   value={totalStars}   icon={<Star size={18} />}           color={isDark ? "#e3b341" : "#9a6700"} bg={isDark ? "rgba(227,179,65,.12)"  : "rgba(154,103,0,.08)"} />
        </Box>
      )}

      {/* ── Tabs — original 2 UNCHANGED + Repositories tab added ────────── */}
      {hasFetched && (
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5, mb: 2 }}>

          <Box role="tablist" aria-label="View issues, pull requests or repositories" sx={{ display: "flex", gap: 0.5 }}>
            {([
              { key: "issues" as const, label: `Issues (${totalIssues})`      },
              { key: "prs"    as const, label: `Pull Requests (${totalPrs})`  },
              { key: "repos"  as const, label: `Repositories (${totalRepos})` }, // NEW
            ]).map(({ key, label }) => (
              <Box
                key={key}
                role="tab"
                aria-selected={tab === key}
                tabIndex={tab === key ? 0 : -1}
                onClick={() => { setTab(key); setPage(0); setStateFilter("all"); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setTab(key); setPage(0); setStateFilter("all"); } }}
                sx={{
                  px: 2.5, py: 0.875, borderRadius: 5,
                  fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                  transition: "background .15s, color .15s",
                  bgcolor: tab === key ? (isDark ? "rgba(88,166,255,.2)" : "rgba(9,105,218,.1)") : "transparent",
                  color:   tab === key ? "primary.main" : "text.secondary",
                  border: `1px solid ${tab === key ? "primary.main" : "transparent"}`,
                  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: "2px" },
                  "&:hover": { bgcolor: isDark ? "rgba(88,166,255,.1)" : "rgba(9,105,218,.06)" },
                }}
              >
                {label}
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Filter + CSV — hidden on repos tab, UNCHANGED otherwise */}
          {tab !== "repos" && (
            <>
              <Tooltip title={showFilters ? "Hide filters" : "Show filters"}>
                <IconButton
                  size="small"
                  onClick={() => setShowFilters((v) => !v)}
                  aria-expanded={showFilters}
                  aria-controls="advanced-filters"
                  aria-label="Toggle advanced filters"
                  sx={{ border: `1px solid ${borderCol}`, borderRadius: 2, px: 1.5, py: 0.75, gap: 0.75, fontSize: "0.78rem", color: "text.secondary" }}
                >
                  <SlidersHorizontal size={15} aria-hidden="true" />
                  {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Export current view as CSV">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => { exportCSV(filtered, `github-${username}-${tab}.csv`); toast.success("CSV downloaded"); }}
                    aria-label="Export results as CSV"
                    disabled={filtered.length === 0}
                    sx={{ border: `1px solid ${borderCol}`, borderRadius: 2, px: 1.5, py: 0.75 }}
                  >
                    <Download size={15} aria-hidden="true" />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}
        </Box>
      )}

      {/* ── Quick filter chips — UNCHANGED, hidden on repos tab ─────────── */}
      {hasFetched && tab !== "repos" && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }} role="group" aria-label="Filter by state">
          {stateOptions.map((opt) => (
            <Chip
              key={opt}
              label={opt.charAt(0).toUpperCase() + opt.slice(1)}
              icon={<Box component="span" sx={{ display: "flex", alignItems: "center" }} aria-hidden="true">{stateChipIcon[opt]}</Box>}
              onClick={() => setStateFilter(opt)}
              variant={stateFilter === opt ? "filled" : "outlined"}
              color={stateFilter === opt ? "primary" : "default"}
              size="small"
              aria-pressed={stateFilter === opt}
              sx={{ cursor: "pointer", fontWeight: stateFilter === opt ? 600 : 400 }}
            />
          ))}
          {(searchTitle || selectedRepo || startDate || endDate) && (
            <Chip
              label="Clear filters"
              size="small" variant="outlined" color="error"
              onClick={() => { setSearchTitle(""); setSelectedRepo(""); setStartDate(""); setEndDate(""); setStateFilter("all"); }}
              aria-label="Clear all filters"
              sx={{ cursor: "pointer" }}
            />
          )}
        </Box>
      )}

      {/* ── Advanced filters — UNCHANGED, hidden on repos tab ───────────── */}
      {tab !== "repos" && (
        <Collapse in={showFilters} id="advanced-filters">
          <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, border: `1px solid ${borderCol}`, bgcolor: surfaceBg }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
              <TextField label="Search title"  size="small" value={searchTitle}  onChange={(e) => setSearchTitle(e.target.value)}  aria-label="Filter by title keyword" />
              <TextField label="Repository"    size="small" value={selectedRepo} onChange={(e) => setSelectedRepo(e.target.value)} aria-label="Filter by repository name" />
              <TextField label="Start date" size="small" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} aria-label="Start date filter" />
              <TextField label="End date"   size="small" type="date" value={endDate}   onChange={(e) => setEndDate(e.target.value)}   InputLabelProps={{ shrink: true }} aria-label="End date filter" />
            </Box>
          </Paper>
        </Collapse>
      )}

      {/* ── NEW: Repositories tab content ───────────────────────────────── */}
      {hasFetched && tab === "repos" && (
        <ReposSection
          repos={repos}
          totalRepos={totalRepos}
          loading={reposLoading}
          error={reposError}
          page={repoPage}
          onPageChange={setRepoPage}
          borderCol={borderCol}
        />
      )}

      {/* ── Results table — UNCHANGED, hidden on repos tab ──────────────── */}
      {hasFetched && tab !== "repos" && (
        <>
          {!loading && (
            <Box sx={{ fontSize: "0.78rem", color: "text.secondary", mb: 1 }}>
              Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "result" : "results"}
              {stateFilter !== "all" || searchTitle || selectedRepo ? " (filtered)" : ` of ${totalCount} total`}
            </Box>
          )}

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${borderCol}`, overflow: "hidden" }}>
            <Table size="small" aria-label={`${tab === "issues" ? "Issues" : "Pull Requests"} table`} stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: surfaceBg }}>
                  {([
                    { key: "title",          label: "Title",      align: "left"   },
                    { key: "repository_url", label: "Repository", align: "center" },
                    { key: "state",          label: "State",      align: "center" },
                    { key: "created_at",     label: "Created",    align: "left"   },
                  ] as { key: SortKey; label: string; align: "left" | "center" }[]).map(({ key, label, align }) => (
                    <TableCell key={key} align={align} sortDirection={sortKey === key ? sortDir : false}
                      sx={{ fontWeight: 600, fontSize: "0.78rem", bgcolor: surfaceBg, borderBottom: `1px solid ${borderCol}`, py: 1.25 }}>
                      <TableSortLabel active={sortKey === key} direction={sortKey === key ? sortDir : "asc"} onClick={() => handleSort(key)} aria-label={`Sort by ${label}`}>
                        {label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading
                  ? Array.from({ length: ROWS_PER_PAGE }).map((_, i) => <SkeletonRow key={i} />)
                  : filtered.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ border: 0, p: 0 }}>
                        <EmptyState searched={hasFetched} />
                      </TableCell>
                    </TableRow>
                  )
                  : filtered.map((item) => (
                    <TableRow key={item.id} hover
                      sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" } }}>

                      <TableCell sx={{ maxWidth: { xs: 160, sm: 300, md: 420 }, py: 1.25 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ flexShrink: 0 }}><StatusIcon item={item} /></Box>
                          <Link
                            href={item.html_url} target="_blank" rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                              fontSize: "0.82rem", fontWeight: 500, color: "text.primary",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block",
                              "&:hover": { color: "primary.main" },
                              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: "2px", borderRadius: 0.5 },
                            }}
                            title={item.title}
                            aria-label={`${item.title} (opens in new tab)`}
                          >
                            {item.title}
                          </Link>
                        </Box>
                      </TableCell>

                      <TableCell align="center" sx={{ py: 1.25 }}>
                        <Chip label={getRepoName(item.repository_url)} size="small" variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 20, borderRadius: 1, maxWidth: 130, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }} />
                      </TableCell>

                      <TableCell align="center" sx={{ py: 1.25 }}>
                        <StateBadge state={getItemState(item)} />
                      </TableCell>

                      <TableCell sx={{ fontSize: "0.78rem", color: "text.secondary", py: 1.25, whiteSpace: "nowrap" }}>
                        {formatDate(item.created_at)}
                      </TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {!loading && filtered.length > 0 && (
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={ROWS_PER_PAGE}
                rowsPerPageOptions={[ROWS_PER_PAGE]}
                aria-label="Table pagination"
                sx={{ borderTop: `1px solid ${borderCol}` }}
              />
            )}
          </TableContainer>
        </>
      )}

      {/* Pre-search prompt — UNCHANGED */}
      {!hasFetched && !loading && (
        <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${borderCol}`, bgcolor: cardBg }}>
          <EmptyState searched={false} />
        </Paper>
      )}

    </Container>
  );
};

export default Tracker;