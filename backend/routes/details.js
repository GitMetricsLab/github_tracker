//Aashish Choudhari's Code | GSSoC Contributor
const express = require('express');
const router = express.Router();
const authenticateGitHub = require('../middlewares/authenticateGitHub');

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

    // Calculate language statistics
    const languageStats = {};
    const repositories = [];
    
    for (const repo of reposResponse.data) {
      try {
        const languagesResponse = await octokit.rest.repos.listLanguages({
          owner: githubUsername,
          repo: repo.name
        });
        
        Object.entries(languagesResponse.data).forEach(([lang, bytes]) => {
          languageStats[lang] = (languageStats[lang] || 0) + bytes;
        });

        repositories.push({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          language: repo.language,
          html_url: repo.html_url,
          updated_at: repo.updated_at
        });
      } catch (err) {
        console.log(`Error fetching languages for ${repo.name}:`, err.message);
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

    // Calculate real contribution stats
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    
    // Get user events for contribution analysis
    let userEvents = [];
    try {
      const eventsResponse = await octokit.rest.activity.listPublicEventsForUser({
        username: githubUsername,
        per_page: 100
      });
      userEvents = eventsResponse.data;
    } catch (err) {
      console.log('Could not fetch user events:', err.message);
    }

    // Calculate contributions from repositories and events
    const totalContributions = userResponse.data.public_repos + 
      userResponse.data.public_gists + 
      (userEvents.length || 0);

    // Calculate streaks and activity patterns
    const contributionsByDate = {};
    userEvents.forEach(event => {
      const date = event.created_at.split('T')[0];
      contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
    });

    // Calculate longest and current streak
    const dates = Object.keys(contributionsByDate).sort();
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || isConsecutiveDay(dates[i-1], dates[i])) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Current streak calculation
    const today = new Date().toISOString().split('T')[0];
    if (dates.length > 0) {
      const lastDate = dates[dates.length - 1];
      if (isRecentDate(lastDate, today)) {
        currentStreak = calculateCurrentStreak(dates);
      }
    }

    // Most active day calculation
    const dayActivityCount = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    userEvents.forEach(event => {
      const dayOfWeek = new Date(event.created_at).getDay();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayActivityCount[dayNames[dayOfWeek]]++;
    });
    
    const mostActiveDay = Object.keys(dayActivityCount).reduce((a, b) => 
      dayActivityCount[a] > dayActivityCount[b] ? a : b
    );

    // Average contributions per day (last 365 days)
    const averagePerDay = userEvents.length > 0 ? (userEvents.length / 365).toFixed(1) : 0;

    const contributionStats = {
      totalContributions,
      longestStreak,
      currentStreak,
      mostActiveDay: getDayFullName(mostActiveDay),
      averagePerDay: parseFloat(averagePerDay)
    };

    // Helper functions
    function isConsecutiveDay(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays === 1;
    }

    function isRecentDate(date, today) {
      const diffTime = Math.abs(new Date(today) - new Date(date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1;
    }

    function calculateCurrentStreak(dates) {
      let streak = 0;
      for (let i = dates.length - 1; i > 0; i--) {
        if (isConsecutiveDay(dates[i-1], dates[i])) {
          streak++;
        } else {
          break;
        }
      }
      return streak + 1;
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