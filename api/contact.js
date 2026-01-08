const nodemailer = require('nodemailer');

// Fallback credentials (use environment variables first, then fallback)
const getEmailConfig = () => {
  // Try environment variables first
  let ceoEmail = process.env.CEO_EMAIL?.trim();
  let ceoAppPassword = process.env.CEO_APP_PASSWORD?.trim()?.replace(/\s+/g, '');
  
  // Fallback to hardcoded values if env vars not set (for deployment)
  if (!ceoEmail) {
    ceoEmail = 'info@propertyreply.com';
  }
  
  if (!ceoAppPassword) {
    // Fallback app password (remove spaces)
    ceoAppPassword = 'ttnwkqnqwjqyrspz';
  }
  
  return { ceoEmail, ceoAppPassword };
};

// Create transporter function
const createTransporter = () => {
  const { ceoEmail, ceoAppPassword } = getEmailConfig();
  
  if (!ceoEmail || !ceoAppPassword) {
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ceoEmail,
      pass: ceoAppPassword
    }
  });
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required fields.' 
      });
    }

    const { ceoEmail } = getEmailConfig();
    const transporter = createTransporter();

    if (!transporter) {
      console.log('Form submission received (email not configured):');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Phone:', phone || 'Not provided');
      console.log('Message:', message);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Your message has been received. We will get back to you within 24 hours.' 
      });
    }

    // Email content for CEO
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
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', ceoEmail);
    } catch (emailError) {
      console.error('Error sending email:', emailError.message);
      console.log('Form data logged instead:');
      console.log('Name:', name, 'Email:', email, 'Phone:', phone || 'N/A', 'Message:', message);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Your message has been received. We will get back to you within 24 hours.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later or contact us directly at info@propertyreply.com' 
    });
  }
};
