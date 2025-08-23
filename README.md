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
3. **Create a new branch** for your change:
  ```bash
  git checkout -b my-first-contribution
  ```
4. **Make your changes** (e.g., edit `README.md` to improve instructions).
5. **Commit and push**:
  ```bash
  git add .
  git commit -m "docs: improve README instructions"
  git push origin my-first-contribution
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

In the project root:
```bash
npm install
```
Then in the backend folder:
```bash
cd backend
npm install
```

### 2. Start the backend server
In the `backend` folder:
```bash
npm start
```

### 3. Start the frontend development server
Open a new terminal in the project root:
```bash
npm run dev
```

### 4. Open the app in your browser
Visit the URL shown in the terminal (usually http://localhost:5173).

> **Note:** Make sure MongoDB is running locally (default: `mongodb://127.0.0.1:27017`).

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
