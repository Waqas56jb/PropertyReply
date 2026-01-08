# Email Setup Instructions for Contact Form

This guide will help you set up Nodemailer to send contact form submissions to the CEO's email.

## Step 1: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install:
- `express` - Backend server framework
- `nodemailer` - Email sending library
- `cors` - Enable cross-origin requests
- `dotenv` - Environment variable management

## Step 2: Create Environment Variables File

Create a `.env` file in the root directory of your project with the following content:

```env
# CEO Email Configuration
CEO_EMAIL=your-ceo-email@gmail.com
CEO_APP_PASSWORD=your-app-password-here

# Optional: Send confirmation email to client
SEND_CLIENT_CONFIRMATION=false

# Server Port
PORT=5000
```

## Step 3: Get App Password (For Gmail)

If you're using Gmail, you need to generate an App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Enable **2-Step Verification** if not already enabled
4. Scroll down to **App passwords**
5. Click **App passwords**
6. Select **Mail** and **Other (Custom name)**
7. Enter "PropertyReply Contact Form" as the name
8. Click **Generate**
9. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)
10. Paste it in your `.env` file as `CEO_APP_PASSWORD` (remove spaces)

## Step 4: For Other Email Providers

### Outlook/Hotmail:
```env
CEO_EMAIL=your-email@outlook.com
CEO_APP_PASSWORD=your-app-password
```

In `server.js`, change:
```javascript
service: 'outlook', // instead of 'gmail'
```

### Yahoo:
```env
CEO_EMAIL=your-email@yahoo.com
CEO_APP_PASSWORD=your-app-password
```

In `server.js`, change:
```javascript
service: 'yahoo', // instead of 'gmail'
```

### Custom SMTP:
If you're using a custom email provider, update the transporter in `server.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.CEO_EMAIL,
    pass: process.env.CEO_APP_PASSWORD
  }
});
```

## Step 5: Update API URL (For Production)

When deploying to production, update the API URL in `src/components/ContactForm.jsx`:

```javascript
const response = await fetch('https://your-domain.com/api/contact', {
  // ... rest of the code
});
```

Or use an environment variable:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/contact`, {
  // ... rest of the code
});
```

## Step 6: Run the Application

### Development Mode:

**Option 1: Run separately (recommended for testing)**
- Terminal 1: `npm run server` (starts backend on port 5000)
- Terminal 2: `npm start` (starts React app on port 3000)

**Option 2: Run together (requires concurrently)**
```bash
npm install -g concurrently
npm run dev
```

### Production Mode:

1. Build the React app: `npm run build`
2. Start the server: `npm run server`
3. Serve the built React app (using a service like PM2, or integrate with your hosting)

## Step 7: Test the Contact Form

1. Fill out the contact form on your website
2. Submit the form
3. Check the CEO's email inbox for the submission
4. The email will contain:
   - Client's name
   - Client's email (clickable, and you can reply directly)
   - Client's phone number (if provided)
   - Client's message

## Troubleshooting

### Error: "Invalid login"
- Double-check your email and app password in `.env`
- Make sure 2-Step Verification is enabled (for Gmail)
- Regenerate the app password if needed

### Error: "Connection timeout"
- Check your internet connection
- Verify the email service settings in `server.js`
- For custom SMTP, verify host and port settings

### CORS Error
- Make sure the backend server is running
- Check that the API URL in `ContactForm.jsx` matches your server URL
- Verify CORS is enabled in `server.js`

### Email not received
- Check spam/junk folder
- Verify the `CEO_EMAIL` in `.env` is correct
- Check server console for error messages
- Test the transporter with the verify function (already included in server.js)

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to Git
- The `.env` file is already in `.gitignore`
- Keep your app password secure
- Use environment variables in production hosting

## Support

If you encounter any issues, check:
1. Server console logs for errors
2. Browser console for frontend errors
3. Email provider's security settings
4. Firewall/network restrictions

