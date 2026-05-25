/**
 * Get the date range for the last 30 days
 * Returns dates in YYYY-MM-DD format suitable for GitHub API queries
 */
export const get30DayWindow = (): { startDate: string; endDate: string } => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(thirtyDaysAgo),
    endDate: formatDate(today),
  };
};
