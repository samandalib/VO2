import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

export interface EmailVerificationData {
  email: string;
  name: string;
  verificationToken: string;
}

export interface PasswordResetData {
  email: string;
  name: string;
  resetToken: string;
}

export class EmailService {
  static async sendVerificationEmail(
    data: EmailVerificationData,
  ): Promise<void> {
    try {
      // In development, we'll log the verification link instead of sending emails
      const isDev = process.env.NODE_ENV !== "production";
      const baseUrl = process.env.APP_BASE_URL || "http://localhost:8080";
      const verificationUrl = `${baseUrl}/verify-email?token=${data.verificationToken}`;

      if (isDev) {
        console.log("\n🔗 EMAIL VERIFICATION LINK (Development Mode):");
        console.log(`📧 To: ${data.email}`);
        console.log(`🎯 Name: ${data.name}`);
        console.log(`🔗 Link: ${verificationUrl}`);
        console.log("📝 Copy this link to verify the email address\n");
        return;
      }

      // Production email sending
      const mailOptions = {
        from: process.env.SMTP_FROM || '"VO₂Max Training" <noreply@vo2max.app>',
        to: data.email,
        subject: "Verify Your Email Address - VO₂Max Training",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">VO₂Max Training</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Welcome to your fitness journey!</p>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                Thanks for signing up for VO₂Max Training! We're excited to help you reach your fitness goals.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px;">
                To get started, please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 50px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  Verify Email Address
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                If you can't click the button, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
              </p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Happy training! 🏃‍♂️💪<br>
                  The VO��Max Training Team
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Hi ${data.name}!

Thanks for signing up for VO₂Max Training! We're excited to help you reach your fitness goals.

To get started, please verify your email address by visiting this link:
${verificationUrl}

This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.

Happy training!
The VO₂Max Training Team
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✓ Verification email sent to ${data.email}`);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const isDev = process.env.NODE_ENV !== "production";

      if (isDev) {
        console.log(`\n🎉 WELCOME EMAIL (Development Mode):`);
        console.log(`📧 To: ${email}`);
        console.log(`👋 Welcome ${name} to VO₂Max Training!\n`);
        return;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || '"VO₂Max Training" <noreply@vo2max.app>',
        to: email,
        subject: "Welcome to VO₂Max Training! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to VO₂Max Training</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to VO₂Max Training!</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 🏃‍♂️</h2>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                Your email has been verified successfully! You're now ready to start your fitness journey with VO₂Max Training.
              </p>
              
              <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
                <h3 style="color: #333; margin-top: 0;">🚀 What's Next?</h3>
                <ul style="margin: 15px 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">📊 <strong>Track your metrics:</strong> Log your VO₂max, heart rate, and training sessions</li>
                  <li style="margin-bottom: 10px;">🩺 <strong>Monitor biomarkers:</strong> Keep track of your health indicators</li>
                  <li style="margin-bottom: 10px;">📈 <strong>View your progress:</strong> Visualize your fitness journey with charts and analytics</li>
                  <li style="margin-bottom: 10px;">🎯 <strong>Set goals:</strong> Create personalized training protocols</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.APP_BASE_URL || "http://localhost:8080"}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 50px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  Go to Dashboard
                </a>
              </div>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Ready to unlock your fitness potential? 💪<br>
                  The VO₂Max Training Team
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✓ Welcome email sent to ${email}`);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error for welcome email as it's not critical
    }
  }

  static async sendPasswordResetEmail(data: PasswordResetData): Promise<void> {
    try {
      // In development, we'll log the reset link instead of sending emails
      const isDev = process.env.NODE_ENV !== "production";
      const baseUrl = process.env.APP_BASE_URL || "http://localhost:8080";
      const resetUrl = `${baseUrl}/reset-password?token=${data.resetToken}`;

      if (isDev) {
        console.log("\n🔑 PASSWORD RESET LINK (Development Mode):");
        console.log(`📧 To: ${data.email}`);
        console.log(`🎯 Name: ${data.name}`);
        console.log(`🔗 Link: ${resetUrl}`);
        console.log("📝 Copy this link to reset the password\n");
        return;
      }

      // Production email sending
      const mailOptions = {
        from: process.env.SMTP_FROM || '"VO₂Max Training" <noreply@vo2max.app>',
        to: data.email,
        subject: "Reset Your Password - VO₂Max Training",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔑 Password Reset</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">VO₂Max Training</p>
            </div>

            <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>

              <p style="font-size: 16px; margin-bottom: 25px;">
                We received a request to reset your password for your VO₂Max Training account.
              </p>

              <p style="font-size: 16px; margin-bottom: 30px;">
                If you made this request, click the button below to create a new password:
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}"
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                          color: white;
                          padding: 15px 30px;
                          text-decoration: none;
                          border-radius: 50px;
                          font-weight: bold;
                          font-size: 16px;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                If you can't click the button, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
              </p>

              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email - your password will remain unchanged.
              </p>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Stay secure! 🔐<br>
                  The VO₂Max Training Team
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Hi ${data.name}!

We received a request to reset your password for your VO₂Max Training account.

If you made this request, visit this link to create a new password:
${resetUrl}

This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email - your password will remain unchanged.

Stay secure!
The VO₂Max Training Team
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✓ Password reset email sent to ${data.email}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }
}
