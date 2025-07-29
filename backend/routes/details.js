//Aashish Choudhari's Code | GSSoC Contributor
const express = require('express');
const router = express.Router();
const authenticateGitHub = require('../middlewares/authenticateGitHub');
const pLimit = require('p-limit');
const { parseISO, differenceInDays, isYesterday, isToday, format } = require('date-fns');

// Simple in-memory cache for language data
const languageCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper function to create delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Cache cleanup function to prevent memory leaks
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of languageCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      languageCache.delete(key);
    }
  }
};

// Run cache cleanup every 15 minutes
setInterval(cleanupCache, 15 * 60 * 1000);

router.post('/get-data', authenticateGitHub, async (req,res)=>{

    try{
    const { octokit, githubUsername } = req;

    // Fetch user's issues and PRs specifically for Home page
    const [issuesResponse, prsResponse] = await Promise.all([
      // Get issues created by user
      octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubUsername} type:issue`,
        sort: 'created',
        order: 'desc',
        per_page: 100
      }),
      // Get pull requests created by user
      octokit.rest.search.issuesAndPullRequests({
        q: `author:${githubUsername} type:pr`,
        sort: 'created',
        order: 'desc',
        per_page: 100
      })
    ]);

    // Process issues data
    const issues = issuesResponse.data.items.map(issue => ({
      id: issue.id,
      title: issue.title,
      state: issue.state,
      created_at: issue.created_at,
      repository_url: issue.repository_url,
      html_url: issue.html_url,
      number: issue.number,
      labels: issue.labels,
      assignees: issue.assignees,
      user: issue.user
    }));
         // Process pull requests data
    const prs = prsResponse.data.items.map(pr => ({
      id: pr.id,
      title: pr.title,
      state: pr.state,
      created_at: pr.created_at,
      repository_url: pr.repository_url,
      html_url: pr.html_url,
      number: pr.number,
      pull_request: {
        merged_at: pr.pull_request?.merged_at || null
      },
      labels: pr.labels,
      assignees: pr.assignees,
      user: pr.user
    }));

    const responseData = {
      issues,
      prs,
      totalIssues: issuesResponse.data.total_count,
      totalPrs: prsResponse.data.total_count
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// New route for comprehensive user analytics
router.post('/user-profile', authenticateGitHub, async (req, res) => {
  try {
    const { octokit, githubUsername } = req;

    // Fetch user profile
    const userResponse = await octokit.rest.users.getByUsername({
      username: githubUsername
    });

    // Fetch user repositories
    const reposResponse = await octokit.rest.repos.listForUser({
      username: githubUsername,
      type: 'all',
      sort: 'updated',
      per_page: 100
    });

    // Calculate language statistics with concurrency control and caching
    const languageStats = {};
    const repositories = [];
    
    // Create limiter for 3 concurrent requests using p-limit
    const limit = pLimit(3);
    
    // Helper function to get cached or fetch language data
    const getLanguageData = async (repo) => {
      const cacheKey = `${githubUsername}/${repo.name}`;
      const cached = languageCache.get(cacheKey);
      
      // Check if cache is valid (not expired)
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
      }
      
      try {
        const languagesResponse = await octokit.rest.repos.listLanguages({
          owner: githubUsername,
          repo: repo.name
        });
        
        // Cache the result
        languageCache.set(cacheKey, {
          data: languagesResponse.data,
          timestamp: Date.now()
        });
        
        return languagesResponse.data;
      } catch (err) {
        console.log(`Error fetching languages for ${repo.name}:`, err.message);
        return {};
      }
    };
    
    // Process repositories in batches with concurrency control
    const batchSize = 10;
    const repos = reposResponse.data;
    
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize);
      
      // Process batch with concurrency limit
      const batchPromises = batch.map(repo => 
        limit(async () => {
          const languages = await getLanguageData(repo);
          
          // Add languages to stats
          Object.entries(languages).forEach(([lang, bytes]) => {
            languageStats[lang] = (languageStats[lang] || 0) + bytes;
          });

          // Build repository object
          return {
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            language: repo.language,
            html_url: repo.html_url,
            updated_at: repo.updated_at
          };
        })
      );
      
      // Wait for current batch to complete
      const batchResults = await Promise.all(batchPromises);
      repositories.push(...batchResults);
      
      // Add small delay between batches to be respectful to GitHub API
      if (i + batchSize < repos.length) {
        await delay(100); // 100ms delay between batches
      }
    }

    // Sort repositories by stars
    const repositoryRanking = repositories.sort((a, b) => b.stars - a.stars);

    // Calculate social stats
    const socialStats = {
      totalStars: repositories.reduce((sum, repo) => sum + repo.stars, 0),
      totalForks: repositories.reduce((sum, repo) => sum + repo.forks, 0),
      totalWatchers: repositories.reduce((sum, repo) => sum + repo.watchers, 0)
    };

    // Calculate real contribution stats using GitHub GraphQL API
    let totalContributions = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let contributionsByDate = {};
    let dayActivityCount = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    try {
      // Get current year and last year for comprehensive data
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;
      
      // GraphQL query to get contribution data for current and last year
      const contributionQuery = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalContributions
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    weekday
                  }
                }
              }
            }
          }
        }
      `;

      // Query for current year
      const currentYearFrom = `${currentYear}-01-01T00:00:00Z`;
      const currentYearTo = `${currentYear}-12-31T23:59:59Z`;
      
      // Query for last year  
      const lastYearFrom = `${lastYear}-01-01T00:00:00Z`;
      const lastYearTo = `${lastYear}-12-31T23:59:59Z`;
      
      // Execute both queries with error handling
      const [currentYearResponse, lastYearResponse] = await Promise.allSettled([
        octokit.graphql(contributionQuery, {
          username: githubUsername,
          from: currentYearFrom,
          to: currentYearTo
        }),
        octokit.graphql(contributionQuery, {
          username: githubUsername,
          from: lastYearFrom,
          to: lastYearTo
        })
      ]);

      // Combine contribution data from both years with error handling
      const allContributionDays = [];
      
      // Process last year data if successful
      if (lastYearResponse.status === 'fulfilled' && 
          lastYearResponse.value?.user?.contributionsCollection?.contributionCalendar?.weeks) {
        lastYearResponse.value.user.contributionsCollection.contributionCalendar.weeks.forEach(week => {
          week.contributionDays.forEach(day => {
            if (day.contributionCount > 0) {
              allContributionDays.push(day);
              contributionsByDate[day.date] = day.contributionCount;
              
              // Count day activity (0=Sunday, 1=Monday, etc.)
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              dayActivityCount[dayNames[day.weekday]] += day.contributionCount;
            }
          });
        });
      }

      // Process current year data if successful
      if (currentYearResponse.status === 'fulfilled' && 
          currentYearResponse.value?.user?.contributionsCollection?.contributionCalendar?.weeks) {
        currentYearResponse.value.user.contributionsCollection.contributionCalendar.weeks.forEach(week => {
          week.contributionDays.forEach(day => {
            if (day.contributionCount > 0) {
              allContributionDays.push(day);
              contributionsByDate[day.date] = day.contributionCount;
              
              // Count day activity
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              dayActivityCount[dayNames[day.weekday]] += day.contributionCount;
            }
          });
        });
      }

      // Calculate total contributions from successful responses
      totalContributions = 
        (currentYearResponse.status === 'fulfilled' ? 
         (currentYearResponse.value?.user?.contributionsCollection?.totalContributions || 0) : 0) +
        (lastYearResponse.status === 'fulfilled' ? 
         (lastYearResponse.value?.user?.contributionsCollection?.totalContributions || 0) : 0);

      // Calculate streaks using accurate contribution dates with improved logic
      const contributionDates = Object.keys(contributionsByDate).sort();
      
      // Calculate longest streak with proper error handling
      let tempStreak = 0;
      if (contributionDates.length > 0) {
        tempStreak = 1; // Start with 1 for first date
        
        for (let i = 1; i < contributionDates.length; i++) {
          if (isConsecutiveDay(contributionDates[i-1], contributionDates[i])) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1; // Reset streak
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak); // Check final streak
      }

      // Calculate current streak with proper date handling
      const today = format(new Date(), 'yyyy-MM-dd'); // Use date-fns for consistent formatting
      if (contributionDates.length > 0) {
        const lastContributionDate = contributionDates[contributionDates.length - 1];
        if (isRecentDate(lastContributionDate, today)) {
          currentStreak = calculateCurrentStreak(contributionDates);
        }
      }

    } catch (err) {
      console.log('Could not fetch contribution data from GraphQL:', err.message);
      // Fallback to basic calculation if GraphQL fails
      totalContributions = userResponse.data.public_repos + userResponse.data.public_gists;
    }

    // Most active day calculation
    const mostActiveDay = Object.keys(dayActivityCount).reduce((a, b) => 
      dayActivityCount[a] > dayActivityCount[b] ? a : b
    );

    // Average contributions per day (based on actual contribution data)
    const daysWithContributions = Object.keys(contributionsByDate).length;
    const averagePerDay = daysWithContributions > 0 ? (totalContributions / daysWithContributions).toFixed(1) : 0;

    const contributionStats = {
      totalContributions,
      longestStreak,
      currentStreak,
      mostActiveDay: getDayFullName(mostActiveDay),
      averagePerDay: parseFloat(averagePerDay)
    };

    // Helper functions with proper date handling using date-fns
    function isConsecutiveDay(date1, date2) {
      try {
        // Parse ISO date strings to Date objects in UTC
        const d1 = parseISO(date1);
        const d2 = parseISO(date2);
        
        // Check if date2 is exactly 1 day after date1 (not using Math.abs)
        const dayDifference = differenceInDays(d2, d1);
        return dayDifference === 1;
      } catch (error) {
        console.error('Error comparing dates:', error);
        return false;
      }
    }

    function isRecentDate(date, today) {
      try {
        // Parse the contribution date
        const contributionDate = parseISO(date);
        const todayDate = parseISO(today);
        
        // Check if the contribution was today or yesterday
        return isToday(contributionDate) || isYesterday(contributionDate) || 
               differenceInDays(todayDate, contributionDate) <= 1;
      } catch (error) {
        console.error('Error checking recent date:', error);
        return false;
      }
    }

    function calculateCurrentStreak(dates) {
      if (!dates || dates.length === 0) return 0;
      
      try {
        let streak = 1; // Start with 1 if we have any contributions
        
        // Work backwards from the most recent date
        for (let i = dates.length - 1; i > 0; i--) {
          if (isConsecutiveDay(dates[i-1], dates[i])) {
            streak++;
          } else {
            break; // Break on first non-consecutive day
          }
        }
        
        return streak;
      } catch (error) {
        console.error('Error calculating current streak:', error);
        return 0;
      }
    }

    function getDayFullName(shortDay) {
      const dayMap = {
        'Sun': 'Sunday',
        'Mon': 'Monday', 
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday'
      };
      return dayMap[shortDay] || 'Monday';
    }

    const responseData = {
      profile: userResponse.data,
      repositories,
      languageStats,
      contributionStats,
      rankings: {
        repositoryRanking
      },
      highlights: {
        topRepo: repositoryRanking[0] || null,
        totalStars: socialStats.totalStars
      },
      stars: repositories.filter(repo => repo.stars > 0),
      commitHistory: [], // Would need more complex API calls
      socialStats
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

module.exports = router;