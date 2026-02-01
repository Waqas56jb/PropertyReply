# Demo Request API Specification

## API Endpoint

**URL:** `POST /api/demo-request`

**Base URL Examples:**
- Development: `http://localhost:5000/api/demo-request`
- Production: `https://property-reply-backend.vercel.app/api/demo-request`

## Request Schema

### Headers
```
Content-Type: application/json
Accept: application/json
```

### Request Body

```json
{
  "agencyName": "string (required)",
  "contactName": "string (required)",
  "email": "string (required, valid email format)",
  "phone": "string (required)",
  "position": "string (optional)",
  "numberOfProperties": "string (optional)",
  "currentSystem": "string (optional)",
  "preferredTime": "string (optional)",
  "requirements": "string (optional)",
  "type": "demo_request"
}
```

### Field Descriptions

| Field | Type | Required | Description | Example Values |
|-------|------|----------|-------------|----------------|
| `agencyName` | string | Yes | Name of the estate agency | "ABC Estate Agents" |
| `contactName` | string | Yes | Full name of the person requesting the demo | "John Smith" |
| `email` | string | Yes | Valid email address | "john.smith@abcestates.com" |
| `phone` | string | Yes | Mobile or phone number | "+44 1234 567890" |
| `position` | string | No | Job title/position | "Director", "Manager", "Owner" |
| `numberOfProperties` | string | No | Approximate number of properties | "1-50", "51-100", "101-250", "251-500", "500+" |
| `currentSystem` | string | No | Current CRM/system in use | "Reapit", "Dezrez", "Vebra", "Custom" |
| `preferredTime` | string | No | Preferred demo time slot | "morning", "afternoon", "evening", "flexible" |
| `requirements` | string | No | Specific requirements or questions | "Looking for integration with..." |
| `type` | string | Yes | Always "demo_request" | "demo_request" |

### Example Request

```json
{
  "agencyName": "ABC Estate Agents",
  "contactName": "John Smith",
  "email": "john.smith@abcestates.com",
  "phone": "+44 1234 567890",
  "position": "Director",
  "numberOfProperties": "101-250",
  "currentSystem": "Reapit",
  "preferredTime": "afternoon",
  "requirements": "We're looking for a solution to handle our high volume of enquiries and would like to see how PropertyReply integrates with our existing CRM.",
  "type": "demo_request"
}
```

### Minimal Request (Required Fields Only)

```json
{
  "agencyName": "XYZ Properties",
  "contactName": "Jane Doe",
  "email": "jane@xyzproperties.co.uk",
  "phone": "+44 9876 543210",
  "type": "demo_request"
}
```

## Response Schema

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Your demo request has been submitted successfully. We'll contact you within 24 hours to schedule your demo."
}
```

### Error Responses

#### 400 Bad Request - Missing Required Fields

```json
{
  "success": false,
  "message": "Agency name, contact name, email, and phone are required fields."
}
```

#### 400 Bad Request - Invalid Email Format

```json
{
  "success": false,
  "message": "Please provide a valid email address."
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
  "message": "Failed to submit demo request. Please try again later or contact us directly at Propertyreply1@gmail.com"
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
CEO_EMAIL=Propertyreply1@gmail.com
CEO_APP_PASSWORD=ttnwkqnqwjqyrspz
```

### Email Details

- **From:** `Propertyreply1@gmail.com`
- **To:** `Propertyreply1@gmail.com`
- **Reply-To:** User's email (from request)
- **Subject:** `New Demo Request from {agencyName} - PropertyReply`

### Email Content

The email should include:
- Agency Name
- Contact Name
- Position (if provided)
- Email (clickable mailto link)
- Phone (clickable tel link)
- Number of Properties (if provided)
- Current System (if provided)
- Preferred Demo Time (if provided)
- Requirements/Questions (if provided)

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
const ceoEmail = process.env.CEO_EMAIL || 'Propertyreply1@gmail.com';
const ceoAppPassword = process.env.CEO_APP_PASSWORD || 'ttnwkqnqwjqyrspz';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ceoEmail,
    pass: ceoAppPassword.replace(/\s+/g, '') // Remove spaces
  }
});

// Helper function to format preferred time
const formatPreferredTime = (time) => {
  const timeMap = {
    'morning': 'Morning (9am-12pm)',
    'afternoon': 'Afternoon (12pm-5pm)',
    'evening': 'Evening (5pm-8pm)',
    'flexible': 'Flexible'
  };
  return timeMap[time] || time;
};

// API Endpoint
app.post('/api/demo-request', async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const {
      agencyName,
      contactName,
      email,
      phone,
      position,
      numberOfProperties,
      currentSystem,
      preferredTime,
      requirements,
      type
    } = req.body;

    // Validation - Required fields
    if (!agencyName || !contactName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Agency name, contact name, email, and phone are required fields.'
      });
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Build email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          🎯 New Demo Request - PropertyReply
        </h2>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #1e293b; margin-top: 0; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 12px; border-radius: 6px; margin: -20px -20px 20px -20px;">
            Agency Information
          </h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 150px;">Agency Name:</td>
              <td style="padding: 10px 0; color: #1e293b; font-size: 16px;"><strong>${agencyName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Contact Name:</td>
              <td style="padding: 10px 0; color: #1e293b;">${contactName}</td>
            </tr>
            ${position ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Position:</td>
              <td style="padding: 10px 0; color: #1e293b;">${position}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 10px 0; color: #1e293b;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Phone:</td>
              <td style="padding: 10px 0; color: #1e293b;">
                <a href="tel:${phone.replace(/\s+/g, '')}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${phone}</a>
              </td>
            </tr>
          </table>
        </div>

        ${numberOfProperties || currentSystem || preferredTime || requirements ? `
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #1e293b; margin-top: 0; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 12px; border-radius: 6px; margin: -20px -20px 20px -20px;">
            Additional Details
          </h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            ${numberOfProperties ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 180px;">Number of Properties:</td>
              <td style="padding: 10px 0; color: #1e293b;">${numberOfProperties}</td>
            </tr>
            ` : ''}
            ${currentSystem ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Current System/CRM:</td>
              <td style="padding: 10px 0; color: #1e293b;">${currentSystem}</td>
            </tr>
            ` : ''}
            ${preferredTime ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Preferred Demo Time:</td>
              <td style="padding: 10px 0; color: #1e293b;">${formatPreferredTime(preferredTime)}</td>
            </tr>
            ` : ''}
          </table>
          
          ${requirements ? `
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <h4 style="color: #1e293b; margin-top: 0; margin-bottom: 10px;">Requirements / Questions:</h4>
            <p style="color: #475569; line-height: 1.6; white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 6px;">${requirements}</p>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #2563eb; border-radius: 8px; font-size: 13px; color: #0c4a6e;">
          <p style="margin: 0; font-weight: 600;">📧 Next Steps:</p>
          <p style="margin: 5px 0 0 0;">Contact ${contactName} at <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a> or <a href="tel:${phone.replace(/\s+/g, '')}" style="color: #2563eb; text-decoration: none;">${phone}</a> to schedule the demo.</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">This email was sent from the PropertyReply demo request form.</p>
          <p style="margin: 5px 0 0 0;">You can reply directly to this email to contact ${contactName} at ${email}.</p>
        </div>
      </div>
    `;

    // Plain text version
    const emailText = `
New Demo Request - PropertyReply

AGENCY INFORMATION:
Agency Name: ${agencyName}
Contact Name: ${contactName}
${position ? `Position: ${position}` : ''}
Email: ${email}
Phone: ${phone}

${numberOfProperties || currentSystem || preferredTime || requirements ? `
ADDITIONAL DETAILS:
${numberOfProperties ? `Number of Properties: ${numberOfProperties}` : ''}
${currentSystem ? `Current System/CRM: ${currentSystem}` : ''}
${preferredTime ? `Preferred Demo Time: ${formatPreferredTime(preferredTime)}` : ''}
${requirements ? `\nRequirements/Questions:\n${requirements}` : ''}
` : ''}

---
This email was sent from the PropertyReply demo request form.
You can reply directly to this email to contact ${contactName} at ${email}.
    `;

    // Email content
    const mailOptions = {
      from: ceoEmail,
      to: ceoEmail,
      replyTo: email,
      subject: `New Demo Request from ${agencyName} - PropertyReply`,
      html: emailHtml,
      text: emailText
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Your demo request has been submitted successfully. We\'ll contact you within 24 hours to schedule your demo.'
    });

  } catch (error) {
    console.error('Error sending demo request email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit demo request. Please try again later or contact us directly at Propertyreply1@gmail.com'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Frontend Integration

The frontend (`DemoRequestForm.jsx`) is already configured to use this API:

```javascript
const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
const apiEndpoint = `${API_URL}/api/demo-request`;

const response = await fetch(apiEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    ...formData,
    type: 'demo_request'
  }),
  mode: 'cors',
});
```

## Testing

### Using cURL

```bash
curl -X POST https://property-reply-backend.vercel.app/api/demo-request \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "agencyName": "Test Estate Agents",
    "contactName": "Test User",
    "email": "test@example.com",
    "phone": "+44 1234 567890",
    "position": "Director",
    "numberOfProperties": "101-250",
    "currentSystem": "Reapit",
    "preferredTime": "afternoon",
    "requirements": "Looking for a demo to see how PropertyReply works.",
    "type": "demo_request"
  }'
```

### Minimal Test Request

```bash
curl -X POST https://property-reply-backend.vercel.app/api/demo-request \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "agencyName": "Test Agency",
    "contactName": "John Doe",
    "email": "john@testagency.com",
    "phone": "+44 9876 543210",
    "type": "demo_request"
  }'
```

### Expected Success Response

```json
{
  "success": true,
  "message": "Your demo request has been submitted successfully. We'll contact you within 24 hours to schedule your demo."
}
```

### Expected Error Response (Missing Fields)

```json
{
  "success": false,
  "message": "Agency name, contact name, email, and phone are required fields."
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

1. **Environment Variables:** Never commit credentials to version control. Use environment variables for `CEO_EMAIL` and `CEO_APP_PASSWORD`.

2. **Input Validation:** 
   - Always validate and sanitize user input
   - Validate email format
   - Sanitize HTML content in requirements field to prevent XSS

3. **Rate Limiting:** Consider adding rate limiting to prevent abuse (e.g., max 3 requests per IP per hour).

4. **Error Handling:** Don't expose sensitive error details to clients. Log errors server-side.

5. **Email Sanitization:** When displaying user input in HTML emails, escape special characters to prevent email injection attacks.

## Email Template Features

The email template includes:
- ✅ Professional HTML formatting
- ✅ Clickable email and phone links
- ✅ Organized sections for agency info and additional details
- ✅ Gradient headers for visual appeal
- ✅ Responsive design
- ✅ Plain text fallback version

## Next Steps for Backend Implementation

1. Create the `/api/demo-request` endpoint
2. Set up environment variables (`CEO_EMAIL`, `CEO_APP_PASSWORD`)
3. Configure nodemailer with Gmail SMTP
4. Implement validation for required fields
5. Add error handling and logging
6. Test with the provided cURL examples
7. Deploy and update frontend API URL if needed
