import { useState } from "react";

type RepoData = {
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string;
  updated_at: string;
  description: string;
};

const RepoCompare = () => {
  const [repo1, setRepo1] = useState("");
  const [repo2, setRepo2] = useState("");

  const [data1, setData1] = useState<RepoData | null>(null);
  const [data2, setData2] = useState<RepoData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRepo = async (repo: string): Promise<RepoData> => {
    const res = await fetch(`https://api.github.com/repos/${repo}`);

    if (!res.ok) {
      throw new Error(`Repository not found: ${repo}`);
    }

    return res.json();
  };

  const handleCompare = async () => {
    if (!repo1 || !repo2) {
      setError("Please enter both repositories");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [r1, r2] = await Promise.all([
        fetchRepo(repo1),
        fetchRepo(repo2),
      ]);

      setData1(r1);
      setData2(r2);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>🔍 GitHub Repo Comparison</h1>

      {/* INPUT SECTION */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="e.g. facebook/react"
          value={repo1}
          onChange={(e) => setRepo1(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />

        <input
          type="text"
          placeholder="e.g. vuejs/core"
          value={repo2}
          onChange={(e) => setRepo2(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />

        <button onClick={handleCompare} style={{ padding: "10px 20px" }}>
          Compare
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      {/* LOADING */}
      {loading && <p>Loading comparison...</p>}

      {/* RESULT TABLE */}
      {data1 && data2 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Metric</th>
                <th style={thStyle}>{data1.full_name}</th>
                <th style={thStyle}>{data2.full_name}</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tdStyle}>⭐ Stars</td>
                <td style={tdStyle}>{data1.stargazers_count}</td>
                <td style={tdStyle}>{data2.stargazers_count}</td>
              </tr>

              <tr>
                <td style={tdStyle}>🍴 Forks</td>
                <td style={tdStyle}>{data1.forks_count}</td>
                <td style={tdStyle}>{data2.forks_count}</td>
              </tr>

              <tr>
                <td style={tdStyle}>🐛 Issues</td>
                <td style={tdStyle}>{data1.open_issues_count}</td>
                <td style={tdStyle}>{data2.open_issues_count}</td>
              </tr>

              <tr>
                <td style={tdStyle}>👀 Watchers</td>
                <td style={tdStyle}>{data1.watchers_count}</td>
                <td style={tdStyle}>{data2.watchers_count}</td>
              </tr>

              <tr>
                <td style={tdStyle}>💻 Language</td>
                <td style={tdStyle}>{data1.language}</td>
                <td style={tdStyle}>{data2.language}</td>
              </tr>

              <tr>
                <td style={tdStyle}>📅 Last Updated</td>
                <td style={tdStyle}>{formatDate(data1.updated_at)}</td>
                <td style={tdStyle}>{formatDate(data2.updated_at)}</td>
              </tr>

              <tr>
                <td style={tdStyle}>🧾 Description</td>
                <td style={tdStyle}>{data1.description}</td>
                <td style={tdStyle}>{data2.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  background: "#f4f4f4",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default RepoCompare;