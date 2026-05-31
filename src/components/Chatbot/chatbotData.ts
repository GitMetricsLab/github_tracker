export interface FAQ {
  keywords: string[];
  answer: string;
}

export const faqs: FAQ[] = [
  {
    keywords: ["token", "access token", "github token", "generate token", "personal access token", "pat"],
    answer: `🔐 **How to get a GitHub Token:**

1. Go to [GitHub Settings → Developer Settings → Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a name and set an expiration date
4. Select scopes: ✅ \`public_repo\` and ✅ \`read:user\`
5. Click **"Generate Token"**
6. **Copy it immediately** — you won't see it again!

Then paste it into the input field when prompted in the app.`,
  },
  {
    keywords: ["install", "setup", "clone", "start", "run", "frontend", "npm", "how to use", "get started", "begin"],
    answer: `🚀 **Frontend Setup:**

\`\`\`bash
git clone https://github.com/mehul-m-prajapati/github_tracker.git
cd github_tracker
npm install
npm run dev
\`\`\`

Then open **http://localhost:5173** in your browser.`,
  },
  {
    keywords: ["backend", "server", "api", "express", "node"],
    answer: `🔧 **Backend Setup:**

\`\`\`bash
cd backend
npm install
npm start
\`\`\`

The backend runs at **http://localhost:5000**

> Make sure you have a \`.env\` file in the \`backend/\` folder with \`MONGO_URI\` and \`SESSION_SECRET\` set.`,
  },
  {
    keywords: ["mongodb", "mongo", "database", "db", "connection", "connect"],
    answer: `🗄️ **MongoDB Setup:**

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start it by running \`mongod\` in your terminal
3. Create a \`backend/.env\` file:

\`\`\`
MONGO_URI=mongodb://127.0.0.1:27017/github_tracker
SESSION_SECRET=anysecretstring
\`\`\`

If MongoDB keeps failing, you can still use the frontend features independently.`,
  },
  {
    keywords: ["test", "jasmine", "spec", "testing", "run test"],
    answer: `✅ **Running Tests:**

\`\`\`bash
mongod          # Start MongoDB first
npx jasmine     # Run the tests
\`\`\`

Test files are in the \`spec/\` directory:
- \`spec/user.model.spec.cjs\`
- \`spec/auth.routes.spec.cjs\`

If you see "No specs found", make sure files are named \`*.spec.js\` or \`*.spec.cjs\`.`,
  },
  {
    keywords: ["what is", "about", "purpose", "app", "tool", "tracker", "github tracker", "features", "does it do"],
    answer: `📊 **About GitHub Tracker:**

GitHub Tracker is a full-stack web app to **track and analyze GitHub user activity**.

**Features include:**
- ⭐ Stars & Forks tracking
- 🐛 Issues monitoring
- 🔀 Open & Closed PRs
- 📈 Activity Analytics
- 👥 Multi-User Tracking
- 🔍 Smart Search

**Tech Stack:** React + Vite, Tailwind + MUI, Node.js + Express, MongoDB, Passport.js`,
  },
  {
    keywords: ["auth", "login", "passport", "authentication", "sign in", "signup"],
    answer: `🔒 **Authentication:**

The app uses **Passport.js** for backend authentication.

- You need to be logged in to access certain features
- Sessions are managed via MongoDB
- Make sure the backend is running for login to work`,
  },
  {
    keywords: ["error", "issue", "problem", "not working", "broken", "crash", "fail"],
    answer: `🛠️ **Common Fixes:**

**MongoDB not connecting?**
→ Run \`mongod\` in a separate terminal and check your \`.env\` file.

**"No specs found" in tests?**
→ Ensure test files are in \`spec/\` and named \`*.spec.cjs\`.

**Frontend not loading?**
→ Run \`npm install\` then \`npm run dev\` from the root folder.

**Still stuck?** Open an issue on the [GitHub repo](https://github.com/mehul-m-prajapati/github_tracker/issues).`,
  },
  {
    keywords: ["tech", "stack", "technology", "react", "vite", "tailwind", "express", "built with"],
    answer: `⚙️ **Tech Stack:**

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS + MUI |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | Passport.js |
| Testing | Jasmine + Supertest |`,
  },
  {
    keywords: ["contribute", "contribution", "pr", "pull request", "open source", "gssoc"],
    answer: `🤝 **How to Contribute:**

1. Fork the repo on GitHub
2. Create a branch: \`git checkout -b feature/your-feature\`
3. Make your changes
4. Commit: \`git commit -m "feat: describe your change"\`
5. Push: \`git push origin feature/your-feature\`
6. Open a **Pull Request** and link the issue number

This project is part of **GSSoC 2026** 🎉`,
  },
];

export const defaultMessage = `👋 Hi! I'm the **GitHub Tracker Assistant**.

I can help you with:
- 🔐 Getting a GitHub access token
- 🚀 Setting up the project
- 🗄️ MongoDB configuration
- ✅ Running tests
- 📊 Understanding the app features
- 🤝 How to contribute

Just type your question below!`;

export function getBotResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  if (!input) return "Please type a question and I'll do my best to help!";

  for (const faq of faqs) {
    if (faq.keywords.some((kw) => input.includes(kw))) {
      return faq.answer;
    }
  }

  return `🤔 I'm not sure about that specific question. Try asking about:

- **GitHub token** — how to generate one
- **Setup** — how to install and run the project  
- **MongoDB** — database connection issues
- **Tests** — how to run Jasmine tests
- **Features** — what the app does

Or open an issue on [GitHub](https://github.com/mehul-m-prajapati/github_tracker/issues) for more help!`;
}
