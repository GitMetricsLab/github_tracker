# GitHub OAuth Setup Guide

## 🚀 Setting up GitHub OAuth for GitHubTracker

To enable "Sign in with GitHub" functionality, you need to create a GitHub OAuth App and configure the environment variables.

### Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following details:
   - **Application name**: `GitHubTracker` (or your preferred name)
   - **Homepage URL**: `http://localhost:5174` (for development)
   - **Authorization callback URL**: `http://localhost:5174/auth/github/callback`
   - **Description**: `GitHub activity tracker application`

4. Click "Register application"
5. Copy the **Client ID** and **Client Secret** (you'll need these for the environment variables)

### Step 2: Configure Environment Variables

Create a `.env` file in the **root directory** with:
```
VITE_BACKEND_URL=http://localhost:5000
VITE_GITHUB_CLIENT_ID=your-github-client-id-here
```

Create a `.env` file in the **backend directory** with:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/github_tracker
SESSION_SECRET=your-secret-key-here
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
FRONTEND_URL=http://localhost:5174
```

### Step 3: Install MongoDB (if not already installed)

For the backend to work, you need MongoDB running:

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start the MongoDB service

**Or use Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Start the Application

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Visit the application:**
   - Frontend: http://localhost:5174
   - Backend: http://localhost:5000

### Step 5: Test GitHub OAuth

1. Go to http://localhost:5174/login
2. Click "Sign in with GitHub"
3. You should be redirected to GitHub for authorization
4. After authorizing, you'll be redirected back to the application

### Production Deployment

For production, update the GitHub OAuth App settings:
- **Homepage URL**: Your production domain
- **Authorization callback URL**: `https://yourdomain.com/auth/github/callback`

And update the environment variables accordingly.

### Troubleshooting

- **"Invalid client" error**: Check that your GitHub Client ID is correct
- **"Redirect URI mismatch"**: Ensure the callback URL in GitHub matches exactly
- **MongoDB connection errors**: Make sure MongoDB is running
- **CORS errors**: Check that the backend CORS configuration allows your frontend URL

### Security Notes

- Never commit your `.env` files to version control
- Use strong, unique session secrets
- Consider using environment-specific OAuth apps for development vs production
- Regularly rotate your GitHub OAuth app secrets 