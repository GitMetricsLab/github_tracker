import { useState, useCallback, useRef } from 'react';
import { Octokit } from '@octokit/core';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkillProfile {
  topLanguages: string[];
  domains: string[];
  activityLevel: 'low' | 'medium' | 'high';
  repoCount: number;
}

export interface Recommendation {
  id: number;
  issueTitle: string;
  issueUrl: string;
  issueNumber: number;
  repoName: string;
  repoUrl: string;
  repoStars: number;
  labels: string[];
  matchReason: string;
  matchedLanguage: string;
  difficulty: 'Beginner' | 'Intermediate';
  score: number;
  createdAt: string;
}

interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  html_url: string;
  fork: boolean;
}

interface GitHubSearchIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  labels: Array<{ name: string }>;
  repository_url: string;
  created_at: string;
  state: string;
}

// ─── Agent Step 1: Skill Profiler ─────────────────────────────────────────────

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  frontend: ['react', 'vue', 'angular', 'next', 'svelte', 'ui', 'css', 'html', 'tailwind', 'vite'],
  backend: ['api', 'server', 'express', 'fastapi', 'django', 'flask', 'spring', 'node', 'graphql'],
  devops: ['docker', 'k8s', 'kubernetes', 'ci', 'deploy', 'terraform', 'aws', 'cloud', 'infra'],
  mobile: ['android', 'ios', 'flutter', 'react-native', 'swift', 'kotlin'],
  data: ['ml', 'ai', 'data', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'jupyter'],
};

const inferDomains = (repos: GitHubRepo[]): string[] => {
  const domainScores: Record<string, number> = {};

  repos.forEach((repo) => {
    const name = repo.name.toLowerCase();
    Object.entries(DOMAIN_KEYWORDS).forEach(([domain, keywords]) => {
      const matches = keywords.filter((kw) => name.includes(kw)).length;
      if (matches > 0) {
        domainScores[domain] = (domainScores[domain] || 0) + matches;
      }
    });
  });

  return Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([domain]) => domain);
};

const buildSkillProfile = (repos: GitHubRepo[]): SkillProfile => {
  // Count language frequency weighted by recency
  const langScore: Record<string, number> = {};
  const now = Date.now();

  repos
    .filter((r) => !r.fork && r.language)
    .forEach((repo) => {
      const lang = repo.language as string;
      const ageMs = now - new Date(repo.pushed_at).getTime();
      const recencyBonus = Math.max(0, 1 - ageMs / (1000 * 60 * 60 * 24 * 365)); // decay over 1 year
      langScore[lang] = (langScore[lang] || 0) + 1 + recencyBonus + repo.stargazers_count * 0.01;
    });

  const topLanguages = Object.entries(langScore)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([lang]) => lang);

  const domains = inferDomains(repos);

  // Activity level: based on number of recently pushed repos (last 90 days)
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const recentlyActive = repos.filter(
    (r) => new Date(r.pushed_at).getTime() > ninetyDaysAgo
  ).length;

  const activityLevel: SkillProfile['activityLevel'] =
    recentlyActive >= 5 ? 'high' : recentlyActive >= 2 ? 'medium' : 'low';

  return {
    topLanguages,
    domains,
    activityLevel,
    repoCount: repos.length,
  };
};

// ─── Agent Step 2: Issue Scout ────────────────────────────────────────────────

const SEARCH_LABELS = ['good first issue', 'help wanted'];

const buildSearchQuery = (language: string, label: string): string => {
  const encodedLabel = label.replace(/ /g, '+');
  return `label:"${encodedLabel}"+language:${language}+is:open+is:public+state:open`;
};

const scoutIssues = async (
  octokit: Octokit,
  skillProfile: SkillProfile
): Promise<GitHubSearchIssue[]> => {
  const queries: Array<{ language: string; label: string; query: string }> = [];

  // Build search combinations: top 2 languages × both labels
  skillProfile.topLanguages.slice(0, 3).forEach((lang) => {
    SEARCH_LABELS.forEach((label) => {
      queries.push({ language: lang, label, query: buildSearchQuery(lang, label) });
    });
  });

  const searchRequests = queries.map(({ query }) =>
    octokit
      .request('GET /search/issues', {
        q: query,
        per_page: 8,
        sort: 'updated',
        order: 'desc',
      })
      .then((res) => res.data.items as GitHubSearchIssue[])
      .catch(() => [] as GitHubSearchIssue[])
  );

  const results = await Promise.allSettled(searchRequests);
  const allIssues: GitHubSearchIssue[] = [];
  const seenIds = new Set<number>();

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      result.value.forEach((issue) => {
        if (!seenIds.has(issue.id)) {
          seenIds.add(issue.id);
          allIssues.push(issue);
        }
      });
    }
  });

  return allIssues;
};

// ─── Agent Step 3: Relevance Ranker ──────────────────────────────────────────

const extractRepoInfo = async (
  octokit: Octokit,
  repositoryUrl: string
): Promise<{ stars: number; repoName: string; repoUrl: string }> => {
  try {
    // repo URL format: https://api.github.com/repos/owner/name
    const parts = repositoryUrl.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    const res = await octokit.request('GET /repos/{owner}/{repo}', { owner, repo });
    return {
      stars: res.data.stargazers_count,
      repoName: `${owner}/${repo}`,
      repoUrl: res.data.html_url,
    };
  } catch {
    const parts = repositoryUrl.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    return { stars: 0, repoName: `${owner}/${repo}`, repoUrl: repositoryUrl };
  }
};

const computeMatchReason = (
  issue: GitHubSearchIssue,
  matchedLanguage: string,
  skillProfile: SkillProfile,
  langRank: number
): string => {
  const isTopLang = langRank === 0;
  const hasGoodFirstIssue = issue.labels.some((l) =>
    l.name.toLowerCase().includes('good first issue')
  );
  const hasHelpWanted = issue.labels.some((l) =>
    l.name.toLowerCase().includes('help wanted')
  );

  if (isTopLang && hasGoodFirstIssue) {
    return `${matchedLanguage} is your #1 language — perfect beginner-friendly entry point`;
  }
  if (isTopLang && hasHelpWanted) {
    return `${matchedLanguage} is your primary language; this project needs contributors like you`;
  }
  if (langRank === 1) {
    return `${matchedLanguage} is your #2 language — great way to deepen your expertise`;
  }
  if (skillProfile.domains.includes('frontend') && matchedLanguage === 'TypeScript') {
    return `TypeScript aligns with your frontend domain activity`;
  }
  return `${matchedLanguage} is in your top languages — strong match with your coding profile`;
};

const scoreIssue = (
  issue: GitHubSearchIssue,
  langRank: number,
  stars: number
): number => {
  let score = 0;

  // Language rank bonus (top language = highest score)
  score += Math.max(0, (3 - langRank)) * 30;

  // Label quality
  const labelNames = issue.labels.map((l) => l.name.toLowerCase());
  if (labelNames.includes('good first issue')) score += 25;
  if (labelNames.includes('help wanted')) score += 15;

  // Star signal (capped)
  score += Math.min(stars / 1000, 20);

  // Recency bonus (last 30 days = full 20pts)
  const daysOld =
    (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 20 - daysOld * 0.5);

  return score;
};

const rankIssues = async (
  octokit: Octokit,
  rawIssues: GitHubSearchIssue[],
  skillProfile: SkillProfile
): Promise<Recommendation[]> => {
  // Fetch repo info for top 15 candidates (to avoid too many requests)
  const candidates = rawIssues.slice(0, 15);

  const enriched = await Promise.allSettled(
    candidates.map(async (issue) => {
      const { stars, repoName, repoUrl } = await extractRepoInfo(
        octokit,
        issue.repository_url
      );

      // Determine which language matched this issue
      const labelNames = issue.labels.map((l) => l.name.toLowerCase());
      let matchedLanguage = skillProfile.topLanguages[0] || 'Unknown';
      let langRank = 0;

      // Try to detect language from label names first
      for (let i = 0; i < skillProfile.topLanguages.length; i++) {
        const lang = skillProfile.topLanguages[i].toLowerCase();
        if (labelNames.some((l) => l.includes(lang))) {
          matchedLanguage = skillProfile.topLanguages[i];
          langRank = i;
          break;
        }
      }

      const score = scoreIssue(issue, langRank, stars);
      const matchReason = computeMatchReason(issue, matchedLanguage, skillProfile, langRank);
      const hasGoodFirstIssue = labelNames.some((l) => l.includes('good first issue'));

      const rec: Recommendation = {
        id: issue.id,
        issueTitle: issue.title,
        issueUrl: issue.html_url,
        issueNumber: issue.number,
        repoName,
        repoUrl,
        repoStars: stars,
        labels: issue.labels.map((l) => l.name),
        matchReason,
        matchedLanguage,
        difficulty: hasGoodFirstIssue ? 'Beginner' : 'Intermediate',
        score,
        createdAt: issue.created_at,
      };

      return rec;
    })
  );

  const ranked: Recommendation[] = enriched
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<Recommendation>).value)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return ranked;
};

// ─── Main Hook ────────────────────────────────────────────────────────────────

export const useContributionRecommender = (getOctokit: () => Octokit | null) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [recommenderLoading, setRecommenderLoading] = useState(false);
  const [recommenderError, setRecommenderError] = useState('');
  const [agentStep, setAgentStep] = useState<0 | 1 | 2 | 3>(0);

  // Cache: avoid re-running for the same username in the same session
  const cacheRef = useRef<{
    username: string;
    recommendations: Recommendation[];
    skillProfile: SkillProfile;
  } | null>(null);

  const runRecommender = useCallback(
    async (username: string, force = false) => {
      const octokit = getOctokit();
      if (!octokit || !username.trim()) return;

      // Return cached result if available and not forced
      if (!force && cacheRef.current?.username === username) {
        setRecommendations(cacheRef.current.recommendations);
        setSkillProfile(cacheRef.current.skillProfile);
        return;
      }

      setRecommenderLoading(true);
      setRecommenderError('');
      setRecommendations([]);
      setSkillProfile(null);

      try {
        // ── Step 1: Skill Profiler ──
        setAgentStep(1);
        const reposRes = await octokit.request('GET /users/{username}/repos', {
          username,
          per_page: 30,
          sort: 'pushed',
          type: 'owner',
        });

        const repos = reposRes.data as GitHubRepo[];
        if (repos.length === 0) {
          setRecommenderError('No public repositories found to build your skill profile.');
          return;
        }

        const profile = buildSkillProfile(repos);
        setSkillProfile(profile);

        if (profile.topLanguages.length === 0) {
          setRecommenderError(
            'Could not detect languages from your repositories. Make sure your repos have languages set on GitHub.'
          );
          return;
        }

        // ── Step 2: Issue Scout ──
        setAgentStep(2);
        const rawIssues = await scoutIssues(octokit, profile);

        if (rawIssues.length === 0) {
          setRecommenderError(
            'No matching open issues found right now. Try again later or add a GitHub token for better results.'
          );
          return;
        }

        // ── Step 3: Relevance Ranker ──
        setAgentStep(3);
        const ranked = await rankIssues(octokit, rawIssues, profile);

        setRecommendations(ranked);

        // Cache the result
        cacheRef.current = { username, recommendations: ranked, skillProfile: profile };
      } catch (err: unknown) {
        const error = err as { status?: number; message?: string };
        if (error.status === 403) {
          setRecommenderError(
            'GitHub API rate limit hit. Add a Personal Access Token in the tracker to get recommendations.'
          );
        } else if (error.status === 404) {
          setRecommenderError('GitHub user not found. Please verify the username.');
        } else {
          setRecommenderError(
            'Unable to generate recommendations. Please check your connection and try again.'
          );
        }
      } finally {
        setRecommenderLoading(false);
        setAgentStep(0);
      }
    },
    [getOctokit]
  );

  return {
    recommendations,
    skillProfile,
    recommenderLoading,
    recommenderError,
    agentStep,
    runRecommender,
  };
};
