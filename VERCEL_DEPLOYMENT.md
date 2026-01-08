# Vercel Deployment Guide

## Setup for Vercel Deployment

### 1. Environment Variables in Vercel

After deploying to Vercel, add these environment variables in your Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add the following:

```
CEO_EMAIL=info@propertyreply.com
CEO_APP_PASSWORD=ttnwkqnqwjqyrspz
```

**Note:** The app password should have NO SPACES (16 characters total).

### 2. Fallback Credentials

The code includes fallback credentials hardcoded in the server files:
- Email: `info@propertyreply.com`
- App Password: `ttnwkqnqwjqyrspz`

These will be used if environment variables are not set, ensuring the email functionality works even if env vars fail to load.

### 3. API Endpoints

The contact form API is available at:
- **Development:** `http://localhost:5000/api/contact`
- **Production/Vercel:** `/api/contact` (relative path)

The ContactForm component automatically detects the environment and uses the correct URL.

### 4. Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Add Environment Variables** in Vercel dashboard (see step 1)

4. **Redeploy** if you added env vars after initial deployment:
   ```bash
   vercel --prod
   ```

### 5. Testing

After deployment:
1. Test the contact form on your live site
2. Check Vercel function logs for any errors
3. Verify emails are being sent to `info@propertyreply.com`

### 6. Troubleshooting

**If emails aren't sending:**
- Check Vercel function logs in the dashboard
- Verify environment variables are set correctly
- Ensure the app password has no spaces
- Check that 2-Step Verification is enabled on the Gmail account

**If API returns 404:**
- Ensure `api/contact.js` exists in your project
- Check that `vercel.json` is configured correctly
- Verify the route is `/api/contact` not `/api/contact/`

### 7. Local Development

For local development, the Express server (`server.js`) runs on port 5000:
```bash
npm run server
```

The React app runs on port 3000:
```bash
npm start
```

Both can run together:
```bash
npm run dev
```
