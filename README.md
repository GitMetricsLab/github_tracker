# 🌟 **GitHub Tracker** 🌟

**Track Activity of Users on GitHub**

Welcome to **GitHub Tracker**, a web app designed to help you monitor and analyze the activity of GitHub users. Whether you’re a developer, a project manager, or just curious, this tool simplifies tracking contributions and activity across repositories! 🚀👩‍💻

<p align="center">
  <img src="public/crl.png" alt="github-tracker">
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

## 📊 What is GitHub Tracker?
GitHub Tracker is a platform for tracking user activity on GitHub, allowing you to see contributions, repository interactions, and much more. Stay informed about your favorite projects and contributors with ease!

---

## 🔑 Key Features

1. **📅 User Activity Feed**: View a comprehensive feed of user activities across repositories.
2. **📈 Contribution Graph**: Analyze contribution trends over time.
3. **🔍 Repository Insights**: Explore detailed statistics for any GitHub repository.

---

## 🛠️ Tech Stack

GitHub Tracker is built using a modern tech stack for optimal performance and user experience:

- **Frontend**: React.js + Vite
- **Styling**: TailwindCSS + Material UI
- **Data Fetching**: Axios + React Query
- **Backend**: Node.js + Express

---

## 🚀 Setup Guide

To set up and run **GitHub Tracker** locally, follow these steps:

### 🗂️ Setting Up GitHub Tracker Repository

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
    <img src="https://contrib.rocks/image?repo=mehul-m-prajapati/github_tracker&&max=1000" />
  </a>
</div>
