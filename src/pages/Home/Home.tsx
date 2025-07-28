import React, { useState } from "react";

const ROWS_PER_PAGE = 10;

// Define the shape of the data received from GitHub
interface GitHubItem {
  id: number;
  title: string;
  state: string;
  created_at: string;
  pull_request?: { merged_at: string | null };
  repository_url: string;
  html_url: string;
}

// Mock hooks for demonstration
const useGitHubAuth = () => ({
  username: "",
  setUsername: (val: string) => {},
  token: "",
  setToken: (val: string) => {},
  error: null,
  getOctokit: () => null,
});

const useGitHubData = (octokit: any) => ({
  issues: [] as GitHubItem[],
  prs: [] as GitHubItem[],
  loading: false,
  error: null,
  fetchData: (username: string) => {},
});

const usePagination = (rowsPerPage: number) => ({
  page: 0,
  itemsPerPage: rowsPerPage,
  handleChangePage: (event: unknown, newPage: number) => {},
  paginateData: (data: GitHubItem[]) => data.slice(0, rowsPerPage),
});

const Home: React.FC = () => {
  // Hooks for managing user authentication
  const {
    username,
    setUsername,
    token,
    setToken,
    error: authError,
    getOctokit,
  } = useGitHubAuth();

  const octokit = getOctokit();
  const {
    issues,
    prs,
    loading,
    error: dataError,
    fetchData,
  } = useGitHubData(octokit);

  const { page, itemsPerPage, handleChangePage, paginateData } =
    usePagination(ROWS_PER_PAGE);

  // State for various filters and tabs
  const [tab, setTab] = useState(0);
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [prFilter, setPrFilter] = useState<string>("all");
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Handle data submission to fetch GitHub data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchData(username);
  };

  // Format date strings into a readable format
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter data based on selected criteria
  const filterData = (
    data: GitHubItem[],
    filterType: string
  ): GitHubItem[] => {
    let filteredData = [...data];

    if (filterType === "open" || filterType === "closed" || filterType === "merged") {
      filteredData = filteredData.filter((item) =>
        filterType === "merged"
          ? item.pull_request?.merged_at
          : item.state === filterType
      );
    }

    if (searchTitle) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (selectedRepo) {
      filteredData = filteredData.filter((item) =>
        item.repository_url.includes(selectedRepo)
      );
    }

    if (startDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.created_at) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.created_at) <= new Date(endDate)
      );
    }

    return filteredData;
  };

  // Get state chip color and icon
  const getStateChip = (item: GitHubItem) => {
    if (item.pull_request?.merged_at) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
          Merged
        </span>
      );
    }
    
    const isOpen = item.state === 'open';
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        isOpen 
          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
          : 'bg-gray-100 text-gray-800 border border-gray-200'
      }`}>
        {item.state.charAt(0).toUpperCase() + item.state.slice(1)}
      </span>
    );
  };

  // Determine the current tab's data
  const currentData =
    tab === 0 ? filterData(issues, issueFilter) : filterData(prs, prFilter);

  // Paginate the filtered data
  const displayData = paginateData(currentData);

  // Main UI rendering
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
             GitHub Dashboard
          </h1>
          <p className="text-xl text-purple-100 font-light drop-shadow-sm">
            Track your issues and pull requests in style
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            🔐 GitHub Authentication
          </h2>
          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-purple-100 text-sm font-medium mb-2">
                GitHub Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                placeholder="Enter your username"
              />
            </div>
            <div className="flex-1 min-w-64">
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Personal Access Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                placeholder="Enter your token"
              />
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                fetchData(username);
              }}
              className="min-w-36 h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-purple-600 hover:to-pink-600"
            >
              🔄 Fetch Data
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            🔍 Filters & Search
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Search Title
              </label>
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="🔍 Search by title..."
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
              />
            </div>

            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Repository
              </label>
              <input
                type="text"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                placeholder="Repository name"
              />
            </div>

            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
              />
            </div>

            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
              />
            </div>
          </div>

          <div className="border-t border-white/20 my-6"></div>

          {/* Tabs and State Filter */}
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div className="flex gap-4">
              <button
                onClick={() => setTab(0)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  tab === 0
                    ? 'bg-white/20 text-white border-2 border-purple-400'
                    : 'bg-white/10 text-purple-200 border-2 border-transparent hover:bg-white/15'
                }`}
              >
                🐛 Issues ({filterData(issues, issueFilter).length})
              </button>
              <button
                onClick={() => setTab(1)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  tab === 1
                    ? 'bg-white/20 text-white border-2 border-purple-400'
                    : 'bg-white/10 text-purple-200 border-2 border-transparent hover:bg-white/15'
                }`}
              >
                🔀 Pull Requests ({filterData(prs, prFilter).length})
              </button>
            </div>

            <div className="min-w-48">
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Filter by State
              </label>
              <select
                value={tab === 0 ? issueFilter : prFilter}
                onChange={(e) =>
                  tab === 0
                    ? setIssueFilter(e.target.value)
                    : setPrFilter(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
              >
                <option value="all" className="bg-purple-900 text-white">All States</option>
                <option value="open" className="bg-purple-900 text-white">Open</option>
                <option value="closed" className="bg-purple-900 text-white">Closed</option>
                {tab === 1 && <option value="merged" className="bg-purple-900 text-white">Merged</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {(authError || dataError) && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-6 py-4 rounded-xl mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{authError || dataError}</span>
            </div>
          </div>
        )}

        {/* Data Table Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
              <h3 className="text-xl text-white font-medium">
                Loading your GitHub data...
              </h3>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <th className="text-left py-4 px-6 text-white font-bold text-lg">Title</th>
                      <th className="text-center py-4 px-6 text-white font-bold text-lg">Repository</th>
                      <th className="text-center py-4 px-6 text-white font-bold text-lg">State</th>
                      <th className="text-center py-4 px-6 text-white font-bold text-lg">Created</th>
                      <th className="text-center py-4 px-6 text-white font-bold text-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item: GitHubItem, index) => (
                      <tr 
                        key={item.id}
                        className={`transition-all duration-300 hover:bg-white/10 hover:transform hover:-translate-y-0.5 ${
                          index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="text-white font-medium max-w-96 truncate">
                            {item.title}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-100 border border-purple-400/50">
                            {item.repository_url.split("/").slice(-1)[0]}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {getStateChip(item)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-purple-200 font-medium">
                            {formatDate(item.created_at)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <a
                            href={item.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-purple-500/30 text-purple-100 border border-purple-400/50 rounded-lg font-semibold hover:bg-purple-500/50 hover:transform hover:scale-105 transition-all duration-300"
                          >
                            🔗 View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                <div className="border-t border-white/20 bg-white/5 px-6 py-4 flex items-center justify-between">
                  <div className="text-purple-200 font-medium">
                    Showing 1 to {Math.min(itemsPerPage, currentData.length)} of {currentData.length} entries
                  </div>
                  <div className="flex gap-2">
                    <button 
                      disabled={page === 0}
                      className="px-4 py-2 bg-purple-500/30 text-purple-100 border border-purple-400/50 rounded-lg font-semibold hover:bg-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Previous
                    </button>
                    <button 
                      disabled={page >= Math.ceil(currentData.length / itemsPerPage) - 1}
                      className="px-4 py-2 bg-purple-500/30 text-purple-100 border border-purple-400/50 rounded-lg font-semibold hover:bg-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;