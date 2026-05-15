export type CommitImportance = 'High' | 'Medium' | 'Low';
export type CommitCategory = 'Feature' | 'Bugfix' | 'Refactor' | 'Chore' | 'Docs' | 'Test' | 'Unknown';

export interface ClassifiedCommit {
  importance: CommitImportance;
  category: CommitCategory;
  score: number;
}

export function classifyCommit(
  message: string,
  filesChanged: number = 0,
  additions: number = 0,
  deletions: number = 0
): ClassifiedCommit {
  const lowerMsg = message.toLowerCase();
  
  let category: CommitCategory = 'Unknown';
  if (/feat\b|feature\b|add\b|implement\b|create\b/.test(lowerMsg)) {
    category = 'Feature';
  } else if (/fix\b|bug\b|patch\b|resolve\b/.test(lowerMsg)) {
    category = 'Bugfix';
  } else if (/refactor\b|clean\b|rework\b/.test(lowerMsg)) {
    category = 'Refactor';
  } else if (/chore\b|bump\b|update\b|depend\b|config\b|format\b|style\b/.test(lowerMsg)) {
    category = 'Chore';
  } else if (/doc\b|readme\b|comment\b/.test(lowerMsg)) {
    category = 'Docs';
  } else if (/test\b|mock\b|spec\b/.test(lowerMsg)) {
    category = 'Test';
  }

  let score = 0;
  
  // Base score from category
  if (category === 'Feature') score += 5;
  if (category === 'Bugfix') score += 4;
  if (category === 'Refactor') score += 3;
  if (category === 'Test') score += 2;
  if (category === 'Docs') score += 1;
  if (category === 'Chore') score += 1;

  // Impact from size (if available, e.g., if fetched specifically, but search API might omit it, defaulting to 0)
  const totalChanges = additions + deletions;
  if (totalChanges > 500) score += 3;
  else if (totalChanges > 100) score += 2;
  else if (totalChanges > 20) score += 1;
  
  if (filesChanged > 10) score += 2;
  else if (filesChanged > 3) score += 1;

  // Keyword modifiers
  if (/wip\b|temp\b|typo\b|minor\b|init\b/.test(lowerMsg)) {
    score -= 2;
  }
  if (/major\b|breaking\b|critical\b|core\b/.test(lowerMsg)) {
    score += 3;
  }

  let importance: CommitImportance = 'Medium';
  if (score >= 6) importance = 'High';
  else if (score <= 2) importance = 'Low';

  return { importance, category, score };
}
