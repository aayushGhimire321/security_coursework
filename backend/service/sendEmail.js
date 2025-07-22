const nodemailer = require('nodemailer');

const createEmailTemplate = async (email, otp, templateType = 'login') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const templateConfig = {
    login: {
      subject: 'FilmSathi - Verify Your Login',
      heading: 'Verify Your Login',
      welcomeMessage: 'Welcome back to FilmSathi!',
      actionText:
        'Please verify your login by entering this verification code:',
      buttonText: 'Verify Login',
    },
    register: {
      subject: 'Welcome to FilmSathi - Verify Your Email',
      heading: 'Verify Your Email Address',
      welcomeMessage: "Welcome to FilmSathi! We're excited to have you join us.",
      actionText:
        'Please verify your email address by entering this verification code:',
      buttonText: 'Verify Email',
    },
    reset: {
      subject: 'FilmSathi - Reset Your Password',
      heading: 'Reset Your Password',
      welcomeMessage: 'We received a request to reset your password.',
      actionText: 'Enter this code to reset your password:',
      buttonText: 'Reset Password',
    },
  };

  const config = templateConfig[templateType];

  const mailOptions = {
    from: {
      name: 'FilmSathi',
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: config.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; line-height: 1.6; color: #0f172a; background-color: #f8fafc;">
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; padding: 32px 20px;">
            <!-- Logo Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background-color: #2a7d73; padding: 24px; border-radius: 16px;">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">FilmSathi</h1>
                <p style="color: #e2e8f0; font-size: 14px; margin: 4px 0 0 0;">Your Gateway to Entertainment</p>
              </div>
            </div>
            
            <!-- Content Card -->
            <div style="background-color: #ffffff; border-radius: 24px; padding: 40px 32px; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);">
              <h2 style="margin: 0 0 24px; color: #0f172a; font-size: 24px; font-weight: 600; text-align: center;">
                ${config.heading}
              </h2>
              
              <p style="margin: 0 0 24px; color: #334155; font-size: 16px;">
                Hi there,<br><br>
                ${config.welcomeMessage} ${config.actionText}
              </p>
              
              <!-- OTP Container -->
              <div style="text-align: center; margin: 32px 0;">
                <div style="background: linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%); border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
                  <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #2a7d73; letter-spacing: 8px;">
                    ${otp}
                  </span>
                  <p style="margin: 16px 0 0 0; font-size: 14px; color: #64748b;">
                    This code will expire in 10 minutes
                  </p>
                </div>
              </div>
              
              <!-- Action Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://movietickets.com/verify" 
                   style="display: inline-block; background: linear-gradient(135deg, #2a7d73 0%, #1a5f57 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                  ${config.buttonText}
                </a>
              </div>
              
              <!-- Security Notice -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 32px 0 0 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 14px; color: #64748b; display: flex; align-items: center;">
                  <span style="margin-right: 8px;">🔒</span>
                  For your security, never share this code with anyone, including FilmSathi staff.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <div style="margin-bottom: 24px;">
                <a href="#" style="color: #2a7d73; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">Privacy</a>
                <a href="#" style="color: #2a7d73; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">Terms</a>
                <a href="#" style="color: #2a7d73; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">Support</a>
              </div>
              <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
                © ${new Date().getFullYear()} FilmSathi. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                This is an automated message, please do not reply.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendLoginVerificationEmail: (email, otp) =>
    createEmailTemplate(email, otp, 'login'),
  sendRegisterOtp: (email, otp) => createEmailTemplate(email, otp, 'register'),
  sendPasswordResetOtp: (email, otp) =>
    createEmailTemplate(email, otp, 'reset'),
};
