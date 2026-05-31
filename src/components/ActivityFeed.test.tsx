import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ActivityFeed from './ActivityFeed';

// 1. Capture the original global fetch to prevent side effects
const originalFetch = global.fetch;

const mockEvents = [
  { 
    id: '12345', 
    type: 'PushEvent', 
    created_at: new Date().toISOString(), 
    repo: { name: 'GitMetricsLab/github_tracker' } 
  }
];

// Helper to generate a full Response-like object to satisfy TypeScript
const createMockResponse = (data: any): Partial<Response> => ({
  ok: true,
  status: 200,
  statusText: 'OK',
  json: async () => data,
});

describe('ActivityFeed Component', () => {
  beforeAll(() => {
    // Mock fetch before the suite runs
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Clear mock history between individual tests
    vi.clearAllMocks();
  });

  afterAll(() => {
    // 2. Restore original fetch after the suite finishes to prevent leaks
    global.fetch = originalFetch;
  });

  it('displays the loading state initially', () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse([]) as Response);
    
    render(<ActivityFeed username="testuser" />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders activity events after successful fetch', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse(mockEvents) as Response);

    render(<ActivityFeed username="testuser" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('🚀 Commit pushed')).toBeInTheDocument();
    expect(screen.getByText(/GitMetricsLab\/github_tracker/)).toBeInTheDocument();
  });

  it('displays a fallback message when no activity is found', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse([]) as Response);

    render(<ActivityFeed username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('No activity found')).toBeInTheDocument();
    });
  });
});
