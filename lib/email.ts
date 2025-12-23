import nodemailer from 'nodemailer';

// Check if email is configured
const isEmailConfigured = !!(
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASSWORD
);

// Create transporter only if email is configured
const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: parseInt(process.env.EMAIL_PORT || '587') === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

export async function sendVerificationEmail(email: string, token: string) {
  // If email is not configured, just log the verification URL
  if (!isEmailConfigured || !transporter) {
    console.warn('⚠️  Email not configured. Skipping verification email.');
    console.log('📧 Verification URL (copy this to verify manually):');
    console.log(`   ${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`);
    return { success: true, skipped: true };
  }

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email - FormFlow',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to FormFlow!</h1>
            </div>
            <div class="content">
              <p>Thank you for signing up! Please verify your email address to get started.</p>
              <p>Click the button below to verify your email:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6366f1;">${verificationUrl}</p>
              <p><strong>Your 10-day free trial starts now!</strong></p>
              <p>After 10 days, you'll need to choose a plan to continue using the service.</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

export async function sendPlanExpiryReminder(email: string, name: string, daysLeft: number) {
  // If email is not configured, skip sending
  if (!isEmailConfigured || !transporter) {
    console.warn('⚠️  Email not configured. Skipping expiry reminder.');
    return { success: true, skipped: true };
  }

  const pricingUrl = `${process.env.NEXTAUTH_URL}/pricing`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `Your free trial expires in ${daysLeft} days - FormFlow`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Free Trial is Ending Soon</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your 10-day free trial will expire in <strong>${daysLeft} days</strong>.</p>
              <p>To continue using FormFlow, please choose a plan that works for you.</p>
              <div style="text-align: center;">
                <a href="${pricingUrl}" class="button">View Pricing Plans</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}
