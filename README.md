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

### 📋 Prerequisites

Before setting up the project locally, ensure the following tools are installed on your system:

- Node.js (v18 or later recommended)
- npm
- Docker
- Docker Compose
- MongoDB (required for backend services and testing)

---

## 📥 Clone the Repository

```bash
git clone https://github.com/GitMetricsLab/github_tracker.git
cd github-tracker
```

---

# 💻 Local Development Setup

This project contains both frontend and backend services.

## ▶️ Frontend Setup

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

---

## ⚙️ Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on:

```txt
http://localhost:5000
```

---

# 🐳 Docker Development Workflow

The project includes Docker configurations for both development and production environments.

## 📦 Development Environment

Run the complete development environment using Docker:

```bash
npm run docker:dev
```

This command:

- Builds frontend and backend containers
- Starts development services
- Enables live file changes using Docker volumes
- Runs frontend and backend simultaneously

### Development Services

| Service | Port |
|----------|------|
| Frontend | 5173 |
| Backend | 5000 |

---

## 🚀 Production Environment

Run the production Docker setup:

```bash
npm run docker:prod
```

This command:

- Creates optimized production builds
- Runs frontend using Nginx
- Starts backend production services

### Production Services

| Service | Port |
|----------|------|
| Frontend | 3000 |
| Backend | 5000 |

---

# 📂 Docker Configuration Overview

| File | Purpose |
|------|----------|
| `Dockerfile.dev` | Development container setup |
| `Dockerfile.prod` | Production container setup |
| `docker-compose.yml` | Multi-service container orchestration |

---

# 🔄 Local Development Workflow

Recommended contributor workflow:

1. Fork the repository
2. Clone your fork locally
3. Create a new branch
4. Install dependencies
5. Run frontend/backend locally or using Docker
6. Make changes
7. Test your implementation
8. Commit and push changes
9. Open a Pull Request

---

# 🌱 Environment Configuration

The project uses environment variables for configuration.

Frontend environment variables:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Backend environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
SESSION_SECRET=your_secret
```

Create corresponding `.env` files before running the application.

---

# 🛠️ Useful Commands

| Command | Description |
|----------|-------------|
| `npm run dev` | Start frontend locally |
| `npm run build` | Create production build |
| `npm run docker:dev` | Run Docker development environment |
| `npm run docker:prod` | Run Docker production environment |
| `npm run test` | Run frontend tests |
| `npm run test:backend` | Run backend tests |

---

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



