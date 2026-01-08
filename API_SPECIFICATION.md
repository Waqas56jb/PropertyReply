# Email API Specification

## API Endpoint

**URL:** `POST /api/contact`

**Base URL Examples:**
- Development: `http://localhost:5000/api/contact`
- Production: `https://your-api-domain.com/api/contact`

## Request Schema

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "phone": "string (optional)",
  "message": "string (required)"
}
```

### Example Request
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+44 1234 567890",
  "message": "I'm interested in learning more about PropertyReply services."
}
```

## Response Schema

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will get back to you within 24 hours."
}
```

### Error Responses

#### 400 Bad Request - Missing Required Fields
```json
{
  "success": false,
  "message": "Name, email, and message are required fields."
}
```

#### 405 Method Not Allowed
```json
{
  "success": false,
  "message": "Method not allowed"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to send message. Please try again later or contact us directly at info@propertyreply.com"
}
```

## CORS Headers Required

The API must include these CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,OPTIONS,PATCH,DELETE,POST,PUT
Access-Control-Allow-Headers: X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version
```

## Email Configuration

### Environment Variables Needed

```env
CEO_EMAIL=info@propertyreply.com
CEO_APP_PASSWORD=ttnwkqnqwjqyrspz
```

### Email Details

- **From:** `info@propertyreply.com`
- **To:** `info@propertyreply.com`
- **Reply-To:** User's email (from request)
- **Subject:** `New Contact Form Submission from {name} - PropertyReply`

### Email Content

The email should include:
- Name
- Email (clickable mailto link)
- Phone (if provided, clickable tel link)
- Message

## Implementation Example

### Node.js/Express Example

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Email configuration
const ceoEmail = process.env.CEO_EMAIL || 'info@propertyreply.com';
const ceoAppPassword = process.env.CEO_APP_PASSWORD || 'ttnwkqnqwjqyrspz';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ceoEmail,
    pass: ceoAppPassword.replace(/\s+/g, '') // Remove spaces
  }
});

// API Endpoint
app.post('/api/contact', async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    // Email content
    const mailOptions = {
      from: ceoEmail,
      to: ceoEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name} - PropertyReply`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #1e293b; margin-top: 0;">Contact Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 120px;">Name:</td>
                <td style="padding: 10px 0; color: #1e293b;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email:</td>
                <td style="padding: 10px 0; color: #1e293b;">
                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #475569;">Phone:</td>
                <td style="padding: 10px 0; color: #1e293b;">
                  <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
                </td>
              </tr>
              ` : ''}
            </table>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
              <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">This email was sent from the PropertyReply contact form.</p>
            <p style="margin: 5px 0 0 0;">You can reply directly to this email to contact ${name} at ${email}.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission - PropertyReply

Contact Details:
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

---
This email was sent from the PropertyReply contact form.
You can reply directly to this email to contact ${name} at ${email}.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or contact us directly at info@propertyreply.com'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Frontend Integration

Update `ContactForm.jsx` to use your new API URL:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-domain.com';
const response = await fetch(`${API_URL}/api/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});
```

## Testing

### Using cURL
```bash
curl -X POST https://your-api-domain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+44 1234 567890",
    "message": "This is a test message"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will get back to you within 24 hours."
}
```

## Required Dependencies

```json
{
  "dependencies": {
    "express": "^4.22.1",
    "nodemailer": "^6.10.1",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1"
  }
}
```

## Security Notes

1. **Environment Variables:** Never commit credentials to version control
2. **Input Validation:** Always validate and sanitize user input
3. **Rate Limiting:** Consider adding rate limiting to prevent abuse
4. **Error Handling:** Don't expose sensitive error details to clients
