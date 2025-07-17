import { supabase } from './supabase';

export interface VerificationCode {
  code: string;
  email: string;
  expiresAt: Date;
  attempts: number;
}

// Store verification codes in memory (in production, use Redis or database)
const verificationCodes = new Map<string, VerificationCode>();

export class VerificationCodeService {
  // Generate a random 4-digit code
  static generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Create a verification code for an email
  static createCode(email: string): VerificationCode {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    const verificationCode: VerificationCode = {
      code,
      email,
      expiresAt,
      attempts: 0,
    };

    verificationCodes.set(email, verificationCode);
    
    console.log(`🔐 Verification code created for ${email}: ${code}`);
    return verificationCode;
  }

  // Verify a code for an email
  static verifyCode(email: string, code: string): { valid: boolean; message: string } {
    const storedCode = verificationCodes.get(email);
    
    if (!storedCode) {
      return { valid: false, message: "No verification code found. Please request a new one." };
    }

    // Check if code has expired
    if (new Date() > storedCode.expiresAt) {
      verificationCodes.delete(email);
      return { valid: false, message: "Verification code has expired. Please request a new one." };
    }

    // Check if too many attempts
    if (storedCode.attempts >= 3) {
      verificationCodes.delete(email);
      return { valid: false, message: "Too many failed attempts. Please request a new code." };
    }

    // Increment attempts
    storedCode.attempts++;

    // Check if code matches
    if (storedCode.code === code) {
      verificationCodes.delete(email);
      return { valid: true, message: "Verification successful!" };
    }

    return { valid: false, message: "Invalid verification code. Please try again." };
  }

  // Get remaining time for a code
  static getRemainingTime(email: string): number {
    const storedCode = verificationCodes.get(email);
    if (!storedCode) return 0;
    const remaining = storedCode.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  }

  // Check if a code exists for an email
  static hasCode(email: string): boolean {
    return verificationCodes.has(email);
  }

  // Remove a code (for cleanup)
  static removeCode(email: string): void {
    verificationCodes.delete(email);
  }
} 