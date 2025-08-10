import { exportToCSV, exportToJSON, generateFilename } from '../exportUtils';

// Mock data for testing
const mockData = [
  {
    id: 1,
    title: 'Test Issue',
    state: 'open',
    created_at: '2024-01-01T00:00:00Z',
    repository_url: 'https://api.github.com/repos/user/repo',
    html_url: 'https://github.com/user/repo/issues/1',
    user: { login: 'testuser' },
    labels: [{ name: 'bug' }, { name: 'help wanted' }]
  },
  {
    id: 2,
    title: 'Test PR',
    state: 'closed',
    created_at: '2024-01-02T00:00:00Z',
    pull_request: { merged_at: '2024-01-03T00:00:00Z' },
    repository_url: 'https://api.github.com/repos/user/repo',
    html_url: 'https://github.com/user/repo/pull/2',
    user: { login: 'testuser' },
    labels: [{ name: 'enhancement' }]
  }
];

// Mock DOM methods
Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
  },
});

Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    href: '',
    download: '',
    click: jest.fn(),
  })),
});

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
});

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn(),
});

describe('Export Utils', () => {
  describe('generateFilename', () => {
    it('should generate correct filename for issues', () => {
      const filename = generateFilename('testuser', 'issues', 'csv');
      expect(filename).toMatch(/github-testuser-issues-\d{4}-\d{2}-\d{2}\.csv/);
    });

    it('should generate correct filename for PRs', () => {
      const filename = generateFilename('testuser', 'prs', 'json');
      expect(filename).toMatch(/github-testuser-prs-\d{4}-\d{2}-\d{2}\.json/);
    });
  });

  describe('exportToCSV', () => {
    it('should throw error for empty data', () => {
      expect(() => exportToCSV([], 'test.csv')).toThrow('No data to export');
    });

    it('should not throw error for valid data', () => {
      expect(() => exportToCSV(mockData, 'test.csv')).not.toThrow();
    });
  });

  describe('exportToJSON', () => {
    it('should throw error for empty data', () => {
      expect(() => exportToJSON([], 'test.json')).toThrow('No data to export');
    });

    it('should not throw error for valid data', () => {
      expect(() => exportToJSON(mockData, 'test.json')).not.toThrow();
    });
  });
});