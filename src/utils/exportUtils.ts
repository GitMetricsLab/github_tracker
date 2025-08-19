interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
  user?: { login: string };
  labels?: Array<{ name: string }>;
}

export const exportToCSV = (data: GitHubItem[], filename: string) => {
  if (!data.length) {
    throw new Error('No data to export');
  }

  const headers = [
    'ID',
    'Title',
    'State',
    'Type',
    'Repository',
    'Author',
    'Labels',
    'Created Date',
    'URL'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`, // Escape quotes in title
      item.pull_request?.merged_at ? 'merged' : item.state,
      item.pull_request ? 'Pull Request' : 'Issue',
      `"${item.repository_url.split('/').slice(-1)[0]}"`,
      `"${item.user?.login || 'N/A'}"`,
      `"${item.labels?.map(label => label.name).join('; ') || 'None'}"`,
      new Date(item.created_at).toLocaleDateString(),
      item.html_url
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToJSON = (data: GitHubItem[], filename: string) => {
  if (!data.length) {
    throw new Error('No data to export');
  }

  const exportData = data.map(item => ({
    id: item.id,
    title: item.title,
    state: item.pull_request?.merged_at ? 'merged' : item.state,
    type: item.pull_request ? 'Pull Request' : 'Issue',
    repository: item.repository_url.split('/').slice(-1)[0],
    author: item.user?.login || 'N/A',
    labels: item.labels?.map(label => label.name) || [],
    createdDate: item.created_at,
    url: item.html_url
  }));

  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateFilename = (username: string, type: 'issues' | 'prs' | 'all', format: 'csv' | 'json') => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `github-${username}-${type}-${timestamp}.${format}`;
};