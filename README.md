# 🌟 **GitHub Tracker** 🌟
<!-- top -->

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
1. Clone the repository to your local machine:
```bash
$ git clone https://github.com/yourusername/github-tracker.git
```

2. Navigate to the project directory:
```bash
$ cd github-tracker
```

3. Run the frontend
```bash
$ npm i
$ npm run dev
```

4. Run the backend
```bash
$ npm i
$ npm start
```

### OAuth2 sign-in (Google & GitHub)

OAuth2 lets users sign in with Google or GitHub. Email/password login still works for local accounts.

#### 1. Copy environment files

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Set these in **`backend/.env`** (required for OAuth redirects and sessions):

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | Long random string for express-session |
| `MONGO_URI` | MongoDB connection string |
| `BACKEND_URL` | Backend base URL (e.g. `http://localhost:5001`) |
| `FRONTEND_URL` | Frontend URL (e.g. `http://localhost:5173`) |

Set in **`.env`** (project root, for the React app):

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Same as `BACKEND_URL` (e.g. `http://localhost:5001`) |

> **Note (macOS):** Port `5000` is often used by AirPlay. If the backend fails to start, set `PORT=5001` in `backend/.env` and use `5001` in `BACKEND_URL` and `VITE_BACKEND_URL`.

#### 2. Set up Google OAuth2

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Go to **APIs & Services → OAuth consent screen**, choose **External**, and complete the required app name and support email fields.
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
4. Application type: **Web application**.
5. **Authorized redirect URIs** — add:
   ```
   http://localhost:5001/api/auth/google/callback
   ```
   (Use your `BACKEND_URL` host/port in production, e.g. `https://your-api.example.com/api/auth/google/callback`.)
6. Copy the **Client ID** and **Client secret** into `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

#### 3. Set up GitHub OAuth App

1. Open [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers) and click **New OAuth App**.
2. Fill in:
   - **Application name:** e.g. `GitHub Tracker (local)`
   - **Homepage URL:** `http://localhost:5173` (or your deployed frontend URL)
   - **Authorization callback URL:**
     ```
     http://localhost:5001/api/auth/github/callback
     ```
     (Match your `BACKEND_URL` in production.)
3. Click **Register application**, then **Generate a new client secret**.
4. Add to `backend/.env`:
   ```env
   GITHUB_OAUTH_CLIENT_ID=your-github-client-id
   GITHUB_OAUTH_CLIENT_SECRET=your-github-client-secret
   ```

> Use a **GitHub OAuth App**, not a Personal Access Token (PAT).

#### 4. Install backend dependencies and restart

From the `backend` folder:

```bash
cd backend
npm install
npm run dev
```

Restart the frontend after changing `.env`:

```bash
npm run dev
```

#### 5. Verify OAuth login

1. Open `http://localhost:5173/login`.
2. Click **Continue with Google** or **Continue with GitHub**.
3. Complete the provider sign-in; you should be redirected back and logged in.

If credentials are missing, the buttons still appear; clicking them shows a message to configure `backend/.env`. After adding secrets and restarting the backend, OAuth sign-in works end-to-end.

**Callback URLs summary** (replace host/port with your `BACKEND_URL`):

| Provider | Callback URL |
|----------|----------------|
| Google | `{BACKEND_URL}/api/auth/google/callback` |
| GitHub | `{BACKEND_URL}/api/auth/github/callback` |

## 🧪 Backend Unit & Integration Testing with Jasmine

This project uses the Jasmine framework for backend unit and integration tests. The tests cover:
- User model (password hashing, schema, password comparison)
- Authentication routes (signup, login, logout)
- Passport authentication logic (via integration tests)

### Prerequisites
- **Node.js** and **npm** installed
- **MongoDB** running locally (default: `mongodb://127.0.0.1:27017`)

### Installation
Install all required dependencies:
```sh
npm install
npm install --save-dev jasmine @types/jasmine supertest express-session passport passport-local bcryptjs
```

### Running the Tests
1. **Start MongoDB** (if not already running):
   ```sh
   mongod
   ```
2. **Run Jasmine tests:**
   ```sh
   npx jasmine
   ```

### Test Files
- `spec/user.model.spec.cjs` — Unit tests for the User model
- `spec/auth.routes.spec.cjs` — Integration tests for authentication routes
- `spec/oauthUser.spec.cjs` — Unit tests for OAuth user helpers

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

[![Star History Chart](https://api.star-history.com/svg?repos=GitMetricsLab/github_tracker&type=Date)](https://www.star-history.com/#GitMetricsLab/github_tracker&Date)

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
