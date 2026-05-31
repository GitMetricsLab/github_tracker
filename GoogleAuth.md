Authentication (Google OAuth)

This project uses Google OAuth 2.0 for user authentication via @react-oauth/google.

```
Setup Required
1. Create Google OAuth Client
    -> Go to Google Cloud Console:
        (https://console.cloud.google.com/apis/credentials?utm_source=chatgpt.com)

    -> Create OAuth Client ID
    -> Choose Web application

2. Configure Authorized Origins
    ->Development
        http://localhost:5173 (the port where your server is running i.e after running npm run dev)
    ->Production
        https://your-domain.com (the deployed url, only imp when you want the app to go live (not for your local computer))
            if working on local computer
                the other javascript origin will be http://localhost

3. Configure Redirect URIs

    ->Development
        http://localhost:5173
    -> Production
        https://your-domain.com (not necessary if you are not gonna deploy the app)

```

Environment Variables
Create a .env file in the root:

VITE_CLIENT_ID=your_google_client_id

⚠️ This is required for Google login to work. 

``

That's it! 
Google authentication will now work all fine !