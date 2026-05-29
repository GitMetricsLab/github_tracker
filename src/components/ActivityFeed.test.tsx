import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ActivityFeed from './ActivityFeed';

global.fetch = vi.fn();

const mockEvents = [
  { 
    id: '12345', 
    type: 'PushEvent', 
    created_at: new Date().toISOString(), 
    repo: { name: 'GitMetricsLab/github_tracker' } 
  }
];

describe('ActivityFeed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the loading state initially', () => {
    (global.fetch as any).mockResolvedValueOnce({ json: async () => [] });
    
    render(<ActivityFeed username="testuser" />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders activity events after successful fetch', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockEvents,
    });

    render(<ActivityFeed username="testuser" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('🚀 Commit pushed')).toBeInTheDocument();
    expect(screen.getByText(/GitMetricsLab\/github_tracker/)).toBeInTheDocument();
  });

  it('displays a fallback message when no activity is found', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => [],
    });

    render(<ActivityFeed username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('No activity found')).toBeInTheDocument();
    });
  });
});
