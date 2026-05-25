# Daily Activity Reminder System - Feature Documentation

## Overview

The Daily Activity Reminder System is a new enhancement to the GitHub Tracker dashboard that motivates users to maintain consistent contribution streaks. It provides real-time insights into your GitHub activity, tracks contribution streaks, and displays motivational reminders to encourage daily contributions.

## Features

### 1. **Daily Activity Status**
   - **Real-time Activity Tracking**: Monitors commits, pull requests, issues, and other GitHub activities throughout the day
   - **Activity Count**: Shows how many contributions you've made today
   - **Last Activity Date**: Displays when your last contribution was

### 2. **Contribution Streak**
   - **Streak Counter**: Tracks consecutive days with GitHub contributions
   - **Visual Indicator**: 🔥 Flame emoji indicates active streaks
   - **Risk Detection**: Alerts you when your streak is at risk (if you haven't contributed today)
   - **Motivational Messages**:
     - 1-day streak: 🎯 Keep it going!
     - 7-day streak: 🔥 You're on a roll!
     - 30-day streak: 🚀 Amazing consistency!
     - 100+ days: 👑 Legendary contributor!

### 3. **Productivity Score**
   - **Dynamic Calculation**: Based on daily activity metrics
   - **Weighted System**: 
     - 25% each for commits, PRs, merges, and issues
     - Bonus points for consecutive streaks (7, 30, 100+ days)
   - **Visual Progress Bar**: Shows score with color coding:
     - Red: 0-50% (Needs improvement)
     - Orange: 50-75% (Good)
     - Green: 75-100% (Excellent)

### 4. **Motivational Reminders**
   - **Inactivity Alerts**: Reminds you when you haven't contributed today
   - **Activity-Specific Messages**:
     - 📌 "Time to make your first contribution today"
     - 🚀 "You haven't committed today"
     - 💻 "No pull requests opened today"
     - 📝 "Consider creating or working on an issue"
   - **Positive Reinforcement**: Congratulatory messages when you're active

### 5. **Activity Breakdown**
   - **Visual Status Indicators**: Quick checklist of today's contributions:
     - Commits
     - Pull Requests Opened
     - Pull Requests Merged
     - Issues Created
   - **Color-Coded**: Green checkmarks for completed activities, gray for pending

## How It Works

### Data Collection
The system analyzes GitHub activity data from the last 30 days by default and identifies:
- **Commits**: Estimated from PR creation activity
- **Pull Requests**: Tracked separately as opened and merged
- **Issues**: Issues created or interacted with
- **Daily Activity**: All contributions made within a 24-hour period

### Streak Calculation
- Streaks are calculated by checking for consecutive days with at least one contribution
- A streak requires activity every day to maintain continuity
- If you miss a day, your streak resets

### Display Logic
The Activity Reminder appears on the Tracker page when:
1. You've successfully fetched GitHub data (entered username and token)
2. Data has been loaded (not in loading state)
3. You have at least some GitHub activity (issues or PRs)

## Using the Feature

### Step 1: Access the Tracker
Navigate to the **Tracker** page in the GitHub Tracker application.

### Step 2: Authenticate
1. Enter your GitHub username
2. Enter your Personal Access Token (PAT)
3. Click "Fetch Data"

### Step 3: View Your Activity
Once data is loaded, the Daily Activity Status section appears above the data table with:
- Today's contribution count
- Current streak
- Productivity score
- Motivational reminders
- Activity breakdown

### Step 4: Respond to Reminders
Use the motivational reminders as guidance to:
- Plan your contributions for the day
- Maintain your contribution streak
- Reach productivity goals

## Token Requirements

To use this feature, you need a Personal Access Token with the following permissions:
- `public_repo` (access to public repositories)
- `repo` (access to private repositories - if tracking private repos)

**Note**: The feature works with or without a token, but with a token you get higher API rate limits.

## Technical Details

### Components
- **`useGitHubActivity` Hook**: Analyzes activity data and returns activity status
- **`ActivityReminder` Component**: Displays the reminder UI with all statistics
- **`activityReminders` Utilities**: Helper functions for generating messages and calculations

### API Integration
The feature leverages the existing GitHub API integration through:
- `useGitHubData` hook for fetching issues and PRs
- `useGitHubAuth` hook for authentication
- Octokit client for GitHub API requests

### Data Processing
- Activity timestamps are extracted from GitHub API responses
- Daily activity is compared against the current date (00:00-23:59)
- Streak calculation traverses activity history backward in time
- Scores are calculated based on weighted activity metrics

## Limitations

1. **Commit Detection**: Direct commit data requires the `/repos/{owner}/{repo}/commits` endpoint, which is not currently used. Commits are estimated from PR activity.
2. **Historical Data**: Only analyzes the last 30 days of issues and PRs due to GitHub API pagination limits.
3. **Rate Limiting**: GitHub API has rate limits (60 requests/hour for unauthenticated, 5000/hour with token).
4. **Timezone**: Activity is determined based on UTC timezone (when GitHub timestamps are recorded).

## Future Enhancements

Potential improvements for future versions:
- [ ] Weekly productivity heatmap
- [ ] Monthly contribution statistics
- [ ] Achievement badges (First commit, 100-day streak, etc.)
- [ ] Custom notification preferences
- [ ] Email/browser notifications for streak reminders
- [ ] Integration with GitHub contributions graph
- [ ] Detailed contribution analytics
- [ ] Goal setting and tracking

## Troubleshooting

### Activity Reminder not showing
- Ensure you've entered your GitHub username and token
- Click "Fetch Data" to load your GitHub activity
- Check that you have at least one issue or PR in your GitHub history

### Streak not updating
- Wait for the page to fully load data
- The streak is calculated based on your GitHub activity timestamps
- Ensure your GitHub activity has timestamps from recent days

### Incorrect productivity score
- Scores are recalculated based on daily activity (commits, PRs, issues)
- The score includes bonus points for longer streaks
- Refresh the page to recalculate with latest data

## Contact & Feedback

If you encounter issues or have suggestions for improvements, please:
1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Include screenshots if relevant

---

**Happy contributing! Keep your streak alive!** 🔥
