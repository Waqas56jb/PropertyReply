const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change to 'outlook', 'yahoo', etc. if using different email provider
  auth: {
    user: process.env.CEO_EMAIL, // CEO's email address
    pass: process.env.CEO_APP_PASSWORD // CEO's app password
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required fields.' 
      });
    }

    // Email content for CEO
    const mailOptions = {
      from: process.env.CEO_EMAIL,
      to: process.env.CEO_EMAIL, // Send to CEO's email
      replyTo: email, // Client's email for easy reply
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

    // Send confirmation email to client (optional)
    if (process.env.SEND_CLIENT_CONFIRMATION === 'true') {
      const clientMailOptions = {
        from: process.env.CEO_EMAIL,
        to: email,
        subject: 'Thank you for contacting PropertyReply',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Thank you for contacting PropertyReply!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p>Best regards,<br>PropertyReply Team</p>
          </div>
        `
      };
      
      transporter.sendMail(clientMailOptions).catch(err => {
        console.log('Error sending confirmation email:', err);
      });
    }

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

