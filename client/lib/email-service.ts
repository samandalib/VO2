// Simple email service for development
// In production, use a real email provider (SendGrid, SES, etc.)

export interface EmailResult {
  success: boolean;
  error?: string;
}

export class EmailService {
  static async sendVerificationCode(email: string, code: string, name?: string): Promise<EmailResult> {
    try {
      console.log(`📧 Sending verification code to ${email}: ${code}`);
      const emailContent = `
        VO₂Max Training App
        
        Hello ${name || 'there'}!
        
        Your verification code is: ${code}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, please ignore this email.
        
        ---
        This is a development email. In production, this would be sent via a proper email service.
      `;
      console.log('📧 Email content:', emailContent);
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: 'Failed to send verification email' };
    }
  }

  static async resendVerificationCode(email: string, code: string, name?: string): Promise<EmailResult> {
    return this.sendVerificationCode(email, code, name);
  }
} 