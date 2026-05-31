import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Link,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Sparkles,
  RefreshCw,
  ExternalLink,
  Star,
  BrainCircuit,
  Search,
  Trophy,
  Zap,
} from 'lucide-react';
import { Octokit } from '@octokit/core';
import {
  useContributionRecommender,
  type Recommendation,
  type SkillProfile,
} from '../hooks/useContributionRecommender';

// ─── Language color map (mirrors Tracker.tsx) ───────────────────────────────

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Java:       '#b07219',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  C:          '#555555',
  'C++':      '#f34b7d',
  'C#':       '#178600',
  PHP:        '#4F5D95',
  Ruby:       '#701516',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Kotlin:     '#A97BFF',
  Swift:      '#F05138',
  Shell:      '#89e051',
  Vue:        '#41b883',
  Dart:       '#00B4AB',
};

const getLangColor = (lang: string) => LANGUAGE_COLORS[lang] ?? '#9ca3af';

// ─── Agent step labels ───────────────────────────────────────────────────────

const AGENT_STEPS = [
  { icon: BrainCircuit, label: 'Building skill profile…' },
  { icon: Search,       label: 'Scouting open issues…'  },
  { icon: Trophy,       label: 'Ranking by relevance…'  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const SkillBadge: React.FC<{ lang: string }> = ({ lang }) => (
  <Chip
    size="small"
    label={lang}
    icon={
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: getLangColor(lang),
          display: 'inline-block',
          ml: '6px !important',
          flexShrink: 0,
        }}
      />
    }
    sx={{
      fontSize: '0.72rem',
      fontWeight: 600,
      height: 24,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      '& .MuiChip-label': { pr: 1 },
    }}
  />
);

const DifficultyBadge: React.FC<{ difficulty: 'Beginner' | 'Intermediate' }> = ({
  difficulty,
}) => (
  <Chip
    size="small"
    label={difficulty}
    sx={{
      fontSize: '0.68rem',
      fontWeight: 700,
      height: 20,
      bgcolor: difficulty === 'Beginner' ? 'rgba(46,164,79,0.12)' : 'rgba(210,153,34,0.12)',
      color: difficulty === 'Beginner' ? '#2ea44f' : '#b08800',
      border: '1px solid',
      borderColor: difficulty === 'Beginner' ? 'rgba(46,164,79,0.3)' : 'rgba(210,153,34,0.3)',
    }}
  />
);

interface RecommendationCardProps {
  rec: Recommendation;
  index: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ rec, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accentColors = ['#6366f1', '#0ea5e9', '#10b981'];
  const accent = accentColors[index % accentColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: 'easeOut' }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)',
          p: 2,
          overflow: 'hidden',
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: accent,
            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.035)',
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 24px ${accent}22`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 3,
            height: '100%',
            bgcolor: accent,
            borderRadius: '2px 0 0 2px',
          },
        }}
      >
        {/* Repo header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: getLangColor(rec.matchedLanguage),
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <Link
              href={rec.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'text.secondary',
                fontFamily: 'monospace',
              }}
            >
              {rec.repoName}
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Star size={12} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {rec.repoStars >= 1000
                ? `${(rec.repoStars / 1000).toFixed(1)}k`
                : rec.repoStars}
            </Typography>
          </Box>
        </Box>

        {/* Issue title */}
        <Link
          href={rec.issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.4,
            mb: 1,
            '&:hover': { color: accent },
            transition: 'color 0.2s',
          }}
        >
          #{rec.issueNumber} {rec.issueTitle}
        </Link>

        {/* Why it matches */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 0.75,
            mb: 1.25,
            p: 1,
            borderRadius: 1,
            bgcolor: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)',
          }}
        >
          <Zap size={13} style={{ color: '#6366f1', flexShrink: 0, marginTop: 2 }} />
          <Typography
            variant="caption"
            sx={{
              color: isDark ? 'rgba(200,200,255,0.8)' : 'rgba(60,60,120,0.85)',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            {rec.matchReason}
          </Typography>
        </Box>

        {/* Labels + Difficulty + CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          {rec.labels.slice(0, 3).map((label) => (
            <Chip
              key={label}
              size="small"
              label={label}
              sx={{
                fontSize: '0.65rem',
                height: 18,
                bgcolor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                fontWeight: 500,
              }}
            />
          ))}
          <DifficultyBadge difficulty={rec.difficulty} />
          <Box sx={{ ml: 'auto' }}>
            <Link
              href={rec.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: accent,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.75 },
              }}
            >
              View Issue
              <ExternalLink size={12} />
            </Link>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton: React.FC<{ agentStep: 0 | 1 | 2 | 3 }> = ({ agentStep }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const stepIndex = Math.max(0, agentStep - 1);
  const StepIcon = agentStep > 0 ? AGENT_STEPS[stepIndex]?.icon : null;
  const stepLabel = agentStep > 0 ? AGENT_STEPS[stepIndex]?.label : 'Initializing…';

  return (
    <Box>
      {/* Agent step indicator */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.18)',
        }}
      >
        <CircularProgress size={16} thickness={5} sx={{ color: '#6366f1' }} />
        {StepIcon && <StepIcon size={16} style={{ color: '#6366f1' }} />}
        <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
          {stepLabel}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
          {[1, 2, 3].map((step) => (
            <Box
              key={step}
              sx={{
                width: 24,
                height: 4,
                borderRadius: 2,
                bgcolor:
                  step <= agentStep
                    ? '#6366f1'
                    : isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                transition: 'background-color 0.4s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Shimmer cards */}
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            p: 2,
            mb: 1.5,
            overflow: 'hidden',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '60%',
              height: '100%',
              background: isDark
                ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.03), transparent)',
              animation: 'recommender-shimmer 1.6s infinite',
              animationDelay: `${i * 0.2}s`,
            },
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'divider', mt: 0.5 }} />
            <Box sx={{ width: 120, height: 12, borderRadius: 1, bgcolor: 'divider' }} />
            <Box sx={{ ml: 'auto', width: 40, height: 12, borderRadius: 1, bgcolor: 'divider' }} />
          </Box>
          <Box sx={{ width: '80%', height: 14, borderRadius: 1, bgcolor: 'divider', mb: 0.75 }} />
          <Box sx={{ width: '60%', height: 14, borderRadius: 1, bgcolor: 'divider', mb: 1.5 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[70, 90, 55].map((w) => (
              <Box key={w} sx={{ width: w, height: 18, borderRadius: 4, bgcolor: 'divider' }} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// ─── Skill Profile Header ─────────────────────────────────────────────────────

const SkillProfileRow: React.FC<{ profile: SkillProfile }> = ({ profile }) => {
  const ACTIVITY_COLORS: Record<string, string> = {
    high:   '#2ea44f',
    medium: '#b08800',
    low:    '#cf222e',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          mb: 2,
          p: 1.25,
          borderRadius: 1.5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5, whiteSpace: 'nowrap' }}
        >
          Your skills:
        </Typography>
        {profile.topLanguages.map((lang) => (
          <SkillBadge key={lang} lang={lang} />
        ))}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: ACTIVITY_COLORS[profile.activityLevel],
              animation: 'recommender-pulse 2s ease-in-out infinite',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: ACTIVITY_COLORS[profile.activityLevel],
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {profile.activityLevel} activity
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface ContributionRecommenderProps {
  username: string;
  getOctokit: () => Octokit | null;
}

const ContributionRecommender: React.FC<ContributionRecommenderProps> = ({
  username,
  getOctokit,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasRunRef = useRef(false);

  const {
    recommendations,
    skillProfile,
    recommenderLoading,
    recommenderError,
    agentStep,
    runRecommender,
  } = useContributionRecommender(getOctokit);

  // Auto-run once when a username is available
  useEffect(() => {
    if (username && !hasRunRef.current) {
      hasRunRef.current = true;
      runRecommender(username);
    }
  }, [username, runRecommender]);

  // Reset auto-run flag if username changes
  useEffect(() => {
    hasRunRef.current = false;
  }, [username]);

  if (!username) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)',
        bgcolor: isDark
          ? 'rgba(17,17,35,0.85)'
          : 'rgba(248,248,255,0.9)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Gradient top accent bar */}
      <Box
        sx={{
          height: 3,
          background: 'linear-gradient(90deg, #6366f1, #0ea5e9, #10b981)',
          borderRadius: '10px 10px 0 0',
        }}
      />

      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={17} color="#fff" />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  background: isDark
                    ? 'linear-gradient(90deg, #a5b4fc, #38bdf8)'
                    : 'linear-gradient(90deg, #4f46e5, #0284c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AI Contribution Recommender
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                Agentic · 3-step pipeline · GitHub Search API
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Re-run recommender" placement="left">
            <span>
              <IconButton
                id="recommender-refresh-btn"
                size="small"
                disabled={recommenderLoading}
                onClick={() => runRecommender(username, true)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#6366f1' },
                  transition: 'color 0.2s',
                }}
              >
                <motion.div
                  animate={recommenderLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    recommenderLoading
                      ? { repeat: Infinity, duration: 1, ease: 'linear' }
                      : { duration: 0 }
                  }
                >
                  <RefreshCw size={17} />
                </motion.div>
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Skill profile */}
        {skillProfile && <SkillProfileRow profile={skillProfile} />}

        {/* Loading state */}
        <AnimatePresence mode="wait">
          {recommenderLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton agentStep={agentStep} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        {!recommenderLoading && recommenderError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              severity="warning"
              sx={{ borderRadius: 1.5, fontSize: '0.82rem' }}
              action={
                <Link
                  component="button"
                  onClick={() => runRecommender(username, true)}
                  sx={{ fontSize: '0.78rem', fontWeight: 700 }}
                >
                  Retry
                </Link>
              }
            >
              {recommenderError}
            </Alert>
          </motion.div>
        )}

        {/* Recommendations */}
        {!recommenderLoading && recommendations.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 700,
                color: 'text.secondary',
                mb: 1.25,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Top {recommendations.length} Recommended Issues for You
            </Typography>
            <AnimatePresence>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {recommendations.map((rec, i) => (
                  <RecommendationCard key={rec.id} rec={rec} index={i} />
                ))}
              </Box>
            </AnimatePresence>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 2,
                color: 'text.disabled',
                textAlign: 'center',
              }}
            >
              Powered by GitHub Search API · Ranked by skill match, recency & repo popularity
            </Typography>
          </Box>
        )}

        {/* Empty state (after load, no error, no results) */}
        {!recommenderLoading && !recommenderError && recommendations.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Sparkles size={28} style={{ color: '#6366f1', opacity: 0.5 }} />
            <Typography variant="body2" sx={{ color: 'text.disabled', mt: 1 }}>
              Enter a GitHub username above and fetch your data to get AI-powered recommendations.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ContributionRecommender;
