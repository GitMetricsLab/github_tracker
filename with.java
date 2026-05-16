<!-- ========================================================= -->
<!-- 🚀 HERO SECTION -->
<!-- ========================================================= -->

<p align="center">
  <img src="public/crl.png" alt="GitHub Tracker Logo" height="120" />
</p>

<h1 align="center">🌟 GitHub Tracker</h1>

<p align="center">
  <strong>Track and analyze GitHub user activity in real time.</strong>
</p>

<p align="center">
  Monitor repositories, commits, pull requests, issues, and contribution trends
  through a clean and intuitive dashboard.
</p>

<p align="center">
  Built for developers, maintainers, recruiters, and open-source enthusiasts.
</p>

<!-- ========================================================= -->
<!-- 🏷️ BADGES -->
<!-- ========================================================= -->

<p align="center">
  <a href="https://github.com/GitMetricsLab/github_tracker/stargazers">
    <img src="https://img.shields.io/github/stars/GitMetricsLab/github_tracker?style=for-the-badge&logo=github&color=yellow" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/GitMetricsLab/github_tracker/network/members">
    <img src="https://img.shields.io/github/forks/GitMetricsLab/github_tracker?style=for-the-badge&logo=github&color=blue" alt="GitHub Forks" />
  </a>
  <a href="https://github.com/GitMetricsLab/github_tracker/issues">
    <img src="https://img.shields.io/github/issues/GitMetricsLab/github_tracker?style=for-the-badge&logo=github&color=red" alt="Open Issues" />
  </a>
  <a href="https://github.com/GitMetricsLab/github_tracker/issues?q=is%3Aissue+is%3Aopen+label%3Agood%20first%20issue">
    <img src="https://img.shields.io/badge/Good%20First%20Issues-Welcome-brightgreen?style=for-the-badge" alt="Good First Issues" />
  </a>
  <a href="https://github.com/GitMetricsLab/github_tracker/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/GitMetricsLab/github_tracker?style=for-the-badge&color=purple" alt="License" />
  </a>
</p>

<p align="center">
  <a href="https://gssoc.girlscript.tech/">
    <img src="https://img.shields.io/badge/GSSoC-2026-orange?style=for-the-badge" alt="GSSoC 2026" />
  </a>
  <a href="https://github.com/GitMetricsLab/github_tracker/commits/main">
    <img src="https://img.shields.io/github/last-commit/GitMetricsLab/github_tracker?style=for-the-badge&color=teal" alt="Last Commit" />
  </a>
</p>

---

<!-- ========================================================= -->
<!-- 📚 TABLE OF CONTENTS -->
<!-- ========================================================= -->

## 📚 Table of Contents

- [📖 About the Project](#-about-the-project)
- [🌐 Live Demo](#-live-demo)
- [📸 Screenshots](#-screenshots)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Architecture](#️-project-architecture)
- [📂 Folder Structure](#-folder-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [▶️ Running the Project](#️-running-the-project)
- [🔌 API Endpoints](#-api-endpoints)
- [🧪 Testing](#-testing)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📜 Code of Conduct](#-code-of-conduct)
- [👨‍💻 Maintainers](#-maintainers)
- [🏆 GSSoC Information](#-gssoc-information)
- [🗺️ Roadmap](#️-roadmap)
- [❓ FAQ](#-faq)
- [📄 License](#-license)
- [📈 Star History](#-star-history)
- [💖 Contributors](#-contributors)
- [⭐ Support the Project](#-support-the-project)

<!-- ========================================================= -->
<!-- 📖 ABOUT THE PROJECT -->
<!-- ========================================================= -->

## 📖 About the Project

GitHub Tracker is a full-stack web application that helps users monitor and analyze GitHub activity in real time. Simply enter a GitHub username to explore repositories, commits, pull requests, issues, contribution trends, and other useful developer insights.

The project is designed for:

- 👨‍💻 Developers tracking their open-source contributions
- 👥 Maintainers reviewing contributor activity
- 🧑‍💼 Recruiters evaluating public GitHub profiles
- 📊 Teams analyzing repository engagement and productivity
- 🌍 Open-source enthusiasts exploring developer metrics

By combining a modern frontend with a robust backend and GitHub API integration, GitHub Tracker presents actionable insights through a clean and intuitive dashboard.

---

<!-- ========================================================= -->
<!-- 🌐 LIVE DEMO -->
<!-- ========================================================= -->

## 🌐 Live Demo

🚀 Explore the application here:

<p align="center">
  <a href="https://github-spy.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Launch-Live%20Demo-2ea44f?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
</p>

You can use the live demo to:
- Search for any public GitHub user
- View repository and contribution metrics
- Explore commits, pull requests, and issues
- Analyze development activity trends

<!-- ========================================================= -->
<!-- 📸 SCREENSHOTS / PREVIEW -->
<!-- ========================================================= -->

## 📸 Screenshots

<img width="1918" height="882" alt="Screenshot 2026-05-16 155123" src="https://github.com/user-attachments/assets/c0adde55-a3a3-4954-8962-bfe2b4dea742" />

<img width="1012" height="375" alt="Screenshot 2026-05-16 155134" src="https://github.com/user-attachments/assets/1d4ddd85-084e-4391-9f93-362d41923cb6" />

<img width="1918" height="858" alt="Screenshot 2026-05-16 155207" src="https://github.com/user-attachments/assets/383f93be-b88b-43e4-bfe2-a7fd4ede39bf" />

---

<!-- ========================================================= -->
<!-- ✨ FEATURES -->
<!-- ========================================================= -->

## ✨ Features

### 🔍 User Search & Profile Insights
- Search for any public GitHub username
- View profile details such as bio, avatar, followers, following, and repositories
- Access account statistics and contribution summaries

### 📁 Repository Analytics
- Browse all public repositories
- View stars, forks, watchers, and open issues
- Analyze repository popularity and activity

### 📈 Contribution Tracking
- Track commits, pull requests, and issues
- Monitor contribution trends over time
- Identify recent development activity

### ⚡ Real-Time Data Fetching
- Fetch live data from the GitHub API
- Fast and responsive interface with optimized API requests

### 📊 Interactive Dashboard
- Clean and intuitive UI
- Visual representation of key metrics
- Responsive design for desktop and mobile

### 🔒 Robust Backend
- Node.js and Express-based API layer
- Secure authentication-ready architecture
- Organized routes and services

### 🧪 Testing Support
- Backend unit and integration testing with Jasmine
- Reliable and maintainable codebase

### 🌍 Open Source Friendly
- Beginner-friendly issues and contribution guidelines
- Active community support for GSSoC and first-time contributors

---

<!-- ========================================================= -->
<!-- 🛠️ TECH STACK -->
<!-- ========================================================= -->

## 🛠️ Tech Stack

### Frontend
- ⚛️ React.js
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧩 Material UI

### Backend
- 🟢 Node.js
- 🚂 Express.js

### Data Fetching & State Management
- 📡 Axios
- 🔄 React Query

### Database & Authentication
- 🍃 MongoDB
- 🔐 Passport.js
- 🔑 bcryptjs
- 🗂️ Express Session

### Testing
- 🧪 Jasmine
- 🔍 Supertest

### APIs
- 🐙 GitHub REST API

<!-- ========================================================= -->
<!-- 🏗️ PROJECT ARCHITECTURE -->
<!-- ========================================================= -->

## 🏗️ Project Architecture

GitHub Tracker follows a full-stack client-server architecture.

```text
┌──────────────────────┐
│      Frontend        │
│ React + Vite         │
│ Tailwind + MUI       │
└─────────┬────────────┘
          │ HTTP Requests
          ▼
┌──────────────────────┐
│      Backend         │
│ Node.js + Express    │
│ REST API             │
└─────────┬────────────┘
          │
          ├── GitHub REST API
          └── MongoDB (optional authentication/data storage)
```
### 🧩 Architectural Components

#### Frontend (Client)
- User interface built with React and Vite
- Responsive styling with Tailwind CSS and Material UI
- Data fetching and caching with React Query
- Interactive charts and metrics display

#### Backend (Server)
- RESTful API built with Node.js and Express
- Authentication support with Passport.js
- Session management using Express Session
- Business logic and API integrations

#### External Services
- GitHub REST API for real-time public repository and user data

#### Database (Optional)
- MongoDB for user accounts, saved searches, and session persistence

### 🎯 Why This Architecture?
- Clear separation of frontend and backend responsibilities
- Scalable and maintainable codebase
- Easy to test and extend
- Supports future features such as saved reports, authentication, and analytics history

<!-- ========================================================= -->
<!-- 📂 FOLDER STRUCTURE -->
<!-- ========================================================= -->

## 📂 Folder Structure

```text
github_tracker/
├── client/                     # Frontend application (React + Vite)
│   ├── public/                 # Static assets
│   │   ├── crl.png             # Project logo
│   │   └── screenshots/        # README screenshots
│   ├── src/
│   │   ├── assets/             # Images, icons, fonts
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API calls and utilities
│   │   ├── context/            # Context providers
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend application (Node.js + Express)
│   ├── config/                 # Database and Passport configuration
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Custom middleware
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── services/               # External API integrations
│   ├── spec/                   # Jasmine unit & integration tests
│   ├── app.js                  # Express application
│   ├── server.js               # Server entry point
│   └── package.json
│
├── .github/
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   ├── workflows/              # GitHub Actions CI/CD workflows
│   └── pull_request_template.md
│
├── .env.example                # Example environment variables
├── .gitignore
├── LICENSE
├── README.md
└── package.json                # Optional root workspace config
```

<!-- ========================================================= -->
<!-- 🚀 GETTING STARTED -->
<!-- ========================================================= -->

## 🚀 Getting Started

Follow these steps to set up GitHub Tracker on your local machine.

### 📋 Prerequisites

Make sure the following tools are installed:

- :contentReference[oaicite:0]{index=0} (v18 or higher recommended)
- :contentReference[oaicite:1]{index=1} (comes with Node.js)
- :contentReference[oaicite:2]{index=2}
- :contentReference[oaicite:3]{index=3} (required if authentication and persistence are enabled)

### 📥 Clone the Repository

```bash
git clone https://github.com/GitMetricsLab/github_tracker.git
cd github_tracker
```
### 📦 Install Dependencies

This project contains separate frontend and backend applications.

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to the project root
cd...
```
### 🔐 Configure Environment Variables

Create a `.env` file in the `server/` directory and add the required environment variables.

```bash
cd server
cp .env.example .env
```
> If `.env.example` is not available, create a new `.env` file manually.

You will configure the required variables in the next section: **Environment Variables**.

<!-- ========================================================= -->
<!-- 🔐 ENVIRONMENT VARIABLES -->
<!-- ========================================================= -->

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory and configure the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/github_tracker

# Session Secret
SESSION_SECRET=your_super_secret_key

# GitHub API (Optional but Recommended)
GITHUB_TOKEN=your_github_personal_access_token
```
### 📝 Variable Descriptions

| Variable | Description |
|----------|-------------|
| `PORT` | Port on which the backend server will run |
| `NODE_ENV` | Application environment (`development` or `production`) |
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret key used to sign sessions |
| `GITHUB_TOKEN` | Personal Access Token to increase GitHub API rate limits |

### 🔑 Creating a GitHub Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token**
3. Select the required scopes (public data access is usually sufficient)
4. Copy the token and add it to your `.env` file

> ⚠️ Never commit your `.env` file or expose secret keys publicly.

---

<!-- ========================================================= -->
<!-- ▶️ RUNNING THE PROJECT -->
<!-- ========================================================= -->

## ▶️ Running the Project

### 1️⃣ Start the Backend Server

```bash
cd server
npm start
```
The backend will typically run at:

```text
http://localhost:5000
```
### 2️⃣ Start the Frontend Development Server

Open a new terminal and run:

```bash
cd client
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

### 3️⃣ Open the Application

Open your browser and visit:

http://localhost:5173

### ✅ Verify Everything Is Working

- ✅ Frontend loads without errors
- ✅ Backend starts successfully
- ✅ MongoDB connects successfully
- ✅ GitHub user search returns live data
- ✅ No environment variable warnings appear

<!-- ========================================================= -->
<!-- 👨‍💻 PROJECT ADMINS / MAINTAINERS -->
<!-- ========================================================= -->

## 👨‍💻 Project Admins / Maintainers

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/mehul-m-prajapati">
        <img src="https://github.com/mehul-m-prajapati.png" width="120px;" alt="Mehul Prajapati"/>
        <br />
        <sub><b>Mehul Prajapati</b></sub>
      </a>
      <br />
      <sub>Project Admin & Maintainer</sub>
    </td>
  </tr>
</table>

---

<!-- ========================================================= -->
<!-- 📄 LICENSE -->
<!-- ========================================================= -->

## 📄 License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for complete details.

---

<!-- ========================================================= -->
<!-- 📈 STAR HISTORY -->
<!-- ========================================================= -->

## 📈 Star History

<a href="https://www.star-history.com/#GitMetricsLab/github_tracker&Date">
  <img
    alt="Star History Chart"
    src="https://api.star-history.com/svg?repos=GitMetricsLab/github_tracker&type=Date"
    width="100%"
  />
</a>

---

<!-- ========================================================= -->
<!-- 💖 CONTRIBUTORS -->
<!-- ========================================================= -->

## 💖 Contributors

We are grateful to all the amazing contributors who have helped build and improve this project 🚀

Thanks for making GitHub Tracker better with every contribution!

<p align="center">
  <a href="https://github.com/GitMetricsLab/github_tracker/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=GitMetricsLab/github_tracker" alt="Contributors" />
  </a>
</p>

### 🙌 How to Become a Contributor

We welcome all contributors, especially from :contentReference[oaicite:0]{index=0} (GSSoC)!

To contribute:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

> ⭐ Don’t forget to star the repository if you find it useful!
