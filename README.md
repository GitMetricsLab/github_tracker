# 🌟 **GitHub Tracker** 🌟
<!-- top -->

## 🚩 Quick Start for Contributors

Want to contribute? Here’s how to get started:

1. **Fork** this repository on GitHub.
2. **Clone** your fork:
  ```bash
  git clone https://github.com/<your-username>/github_tracker.git
  cd github_tracker
  ```
3. **Add the upstream remote and sync** (original repository):
  ```bash
  git remote add upstream https://github.com/GitMetricsLab/github_tracker.git
  git fetch upstream
  # create your branch from the latest upstream main
  git checkout -b my-first-contribution upstream/main
  ```
4. **Make your changes** (e.g., edit `README.md` to improve instructions).
5. **Commit and push**:
  ```bash
  git add .
  git commit -m "docs(readme): improve setup instructions"
  git push -u origin my-first-contribution
  ```
6. **Open a Pull Request** from your branch to the main repository.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for more details!


**Track Activity of Users on GitHub**

Welcome to **GitHub Tracker**, a web app designed to help you monitor and analyze the activity of GitHub users. Whether you’re a developer, a project manager, or just curious, this tool simplifies tracking contributions and activity across repositories! 🚀👩‍💻

<p align="center">
  <img src="public/crl.png" height="60px" alt="github-tracker">
</p>
<table align="center">
    <thead align="center">
        <tr border: 2px;>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Close PRs</b></td>
        </tr>
     </thead>
    <tbody>
      <tr>
          <td><img alt="Stars" src="https://img.shields.io/github/stars/mehul-m-prajapati/github_tracker?style=flat&logo=github"/></td>
          <td><img alt="Forks" src="https://img.shields.io/github/forks/mehul-m-prajapati/github_tracker?style=flat&logo=github"/></td>
          <td><img alt="Issues" src="https://img.shields.io/github/issues/mehul-m-prajapati/github_tracker?style=flat&logo=github"/></td>
          <td><img alt="Open Pull Requests" src="https://img.shields.io/github/issues-pr/mehul-m-prajapati/github_tracker?style=flat&logo=github"/></td>
          <td><img alt="Closed Pull Requests" src="https://img.shields.io/github/issues-pr-closed/mehul-m-prajapati/github_tracker?style=flat&color=critical&logo=github"/></td>
      </tr>
    </tbody>
</table>

---

## 🛠️ Tech Stack

- **Frontend**: React.js + Vite
- **Styling**: TailwindCSS + Material UI
- **Data Fetching**: Axios + React Query
- **Backend**: Node.js + Express

---

## 🚀 Setup Guide

### 1. Install dependencies for both frontend and backend

Preferred (one command):
```bash
npm run setup
```
Fallback (manual):
```bash
npm install
cd backend && npm install
```
> Tip: Use the project’s Node.js version. If you’ve set it in `.nvmrc` or `package.json#engines`, nvm will pick it up.
>
> With nvm:
> ```bash
> nvm use
> ```

### 2. Configure environment variables (backend)
Copy the sample env file and set required variables:
```bash
cp backend/.env.sample backend/.env
```
PowerShell (Windows):
```powershell
Copy-Item backend/.env.sample backend/.env
```
Then edit `backend/.env` and set at least:
- `MONGO_URI` (e.g., `mongodb://127.0.0.1:27017/githubTracker`)
- `SESSION_SECRET` (e.g., a long random string)
- `PORT` (e.g., `5000`)

### 3. Start the backend server
In the `backend` folder:
```bash
npm start
```

### 4. Start the frontend development server
Open a new terminal in the project root:
```bash
npm run dev
```

### 5. Open the app in your browser
Visit the URL shown in the terminal (usually <http://localhost:5173>).
If the backend runs locally, it typically listens on <http://localhost:5000> (or the value of `PORT` in your `.env`).

> **Note:** Make sure MongoDB is running locally (default: `mongodb://127.0.0.1:27017`).
>
> Optional: Run MongoDB with Docker
> ```bash
> docker volume create github-tracker-mongo
> docker run --name github-tracker-mongo \
>   -p 27017:27017 \
>   -v github-tracker-mongo:/data/db \
>   -d mongo:6
>
> # Then, point your app at this database, for example:
> # export MONGO_URI="mongodb://127.0.0.1:27017/githubTracker"
> ```

Alternatively, to start the full stack with Compose:

```bash
# Dev profile (hot reload etc.)
npm run docker:dev

# Production-like profile
npm run docker:prod
```

## 🧪 Backend Unit & Integration Testing with Jasmine

This project uses the Jasmine framework for backend unit and integration tests. The tests cover:
- [User model (password hashing, schema, password comparison)](spec/user.model.spec.cjs)
- [Authentication routes (signup, login, logout)](spec/auth.routes.spec.cjs)
- Passport authentication logic (via integration tests)

### Prerequisites
- **Node.js** and **npm** installed
- **MongoDB** running locally (default: `mongodb://127.0.0.1:27017`)

### Installation
Install dependencies (root and backend) if you haven’t already:
```bash
npm run setup
```
Jasmine is already configured in the repo; if missing locally:
```bash
npm install --save-dev jasmine
```

### Running the Tests
1. **Start MongoDB** (if not already running):
   ```sh
   mongod
   ```
2. **Run Jasmine tests (from the repository root) with the MJS config:**

  macOS/Linux (Bash):
  ```bash
  # Use a test database (e.g., github_tracker_test) to avoid clobbering dev data
  MONGO_URI="mongodb://127.0.0.1:27017/github_tracker_test" npx jasmine --config=spec/support/jasmine.mjs
  ```

  Windows (PowerShell):
  ```powershell
  # Use a test database (e.g., github_tracker_test) to avoid clobbering dev data
  $env:MONGO_URI="mongodb://127.0.0.1:27017/github_tracker_test"; npx jasmine --config=spec/support/jasmine.mjs
  ```

### Test Files
- [`spec/user.model.spec.cjs`](spec/user.model.spec.cjs) — Unit tests for the User model
- [`spec/auth.routes.spec.cjs`](spec/auth.routes.spec.cjs) — Integration tests for authentication routes

### Jasmine Configuration
The Jasmine config (`spec/support/jasmine.mjs`) is set to recognize `.cjs`, `.js`, and `.mjs` test files:
```js
spec_files: [
  "**/*[sS]pec.?(m)js",
  "**/*[sS]pec.cjs"
]
```

### Troubleshooting
- **No specs found:** Ensure your test files have the correct extension and are in the `spec/` directory.
- **MongoDB connection errors:** Make sure MongoDB is running and accessible.
- **Missing modules:** Install any missing dev dependencies with `npm install --save-dev <module>`.

### What Was Covered
- Jasmine is set up and configured for backend testing.
- All major backend modules are covered by unit/integration tests.
- Tests are passing and verified.

---

# 👀 Our Contributors

- We extend our heartfelt gratitude for your invaluable contribution to our project.
- Make sure you show some love by giving ⭐ to our repository.

<div align="center">
  <a href="https://github.com/mehul-m-prajapati/github_tracker">
    <img src="https://contrib.rocks/image?repo=GitMetricsLab/github_tracker&&max=1000" />
  </a>
</div>



---

<p align="center">
  <a href="#top" style="font-size: 18px; padding: 8px 16px; display: inline-block; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;">
    ⬆️ Back to Top
  </a>
</p>
