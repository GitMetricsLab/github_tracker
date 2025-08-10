# 📊 Data Export Feature

## Overview
The Data Export feature allows users to export their GitHub issues and pull requests data in CSV and JSON formats for further analysis, reporting, or backup purposes.

## Features

### 🔄 Export Formats
- **CSV Format**: Spreadsheet-compatible format perfect for Excel, Google Sheets, or data analysis tools
- **JSON Format**: Developer-friendly format ideal for programmatic processing or API integration

### 📋 Export Options
1. **Current Tab Export**: Export only the currently viewed data (Issues or Pull Requests)
2. **Export All**: Export both issues and pull requests in a single file
3. **Filtered Export**: Export respects all active filters (search, date range, repository, state)

### 📁 File Structure

#### CSV Export Columns
- ID: GitHub item ID
- Title: Issue/PR title
- State: Current state (open, closed, merged)
- Type: Issue or Pull Request
- Repository: Repository name
- Author: GitHub username of the author
- Labels: Comma-separated list of labels
- Created Date: Creation date in local format
- URL: Direct link to the GitHub item

#### JSON Export Structure
```json
[
  {
    "id": 123456,
    "title": "Fix authentication bug",
    "state": "closed",
    "type": "Issue",
    "repository": "github-tracker",
    "author": "username",
    "labels": ["bug", "authentication"],
    "createdDate": "2024-01-15T10:30:00Z",
    "url": "https://github.com/user/repo/issues/123"
  }
]
```

## Usage

### Basic Export
1. Navigate to the Tracker page
2. Enter your GitHub username and token
3. Click "Fetch Data" to load your GitHub activity
4. Click the "Export" button next to the state filter
5. Choose your preferred format (CSV or JSON)
6. The file will be automatically downloaded

### Export All Data
1. After loading data, look for the "Export" button in the filters section
2. This exports both issues and pull requests combined
3. Choose your format and download

### Export with Filters
1. Apply any combination of filters:
   - Search by title
   - Filter by repository
   - Set date range
   - Select state (open/closed/merged)
2. Click "Export" to download only the filtered results

## File Naming Convention
Files are automatically named using the pattern:
`github-{username}-{type}-{date}.{format}`

Examples:
- `github-johndoe-issues-2024-01-15.csv`
- `github-johndoe-prs-2024-01-15.json`
- `github-johndoe-all-2024-01-15.csv`

## Technical Implementation

### Components
- `ExportButton.tsx`: Main export component with dropdown menu
- `exportUtils.ts`: Utility functions for data processing and file generation

### Key Functions
- `exportToCSV()`: Converts data to CSV format and triggers download
- `exportToJSON()`: Converts data to JSON format and triggers download
- `generateFilename()`: Creates standardized filenames
- `downloadFile()`: Handles browser download functionality

### Error Handling
- Empty data validation
- Format-specific error handling
- User-friendly error messages via toast notifications
- Success confirmations

## Browser Compatibility
- Modern browsers with Blob API support
- File download functionality
- No server-side processing required

## Future Enhancements
- [ ] Excel (.xlsx) format support
- [ ] Custom column selection for CSV
- [ ] Scheduled exports
- [ ] Email export functionality
- [ ] Export templates
- [ ] Bulk repository analysis export