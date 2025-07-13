/**
 * Authentication validation utilities
 * Centralized validation logic for auth-related data
 */

import { AUTH_CONFIG } from "./constants";
import { ValidationError } from "./errors";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EmailValidationOptions {
  required?: boolean;
  allowEmpty?: boolean;
}

export interface PasswordValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

/**
 * Validate email address
 */
export function validateEmail(
  email: string,
  options: EmailValidationOptions = {},
): ValidationResult {
  const errors: string[] = [];
  const { required = true, allowEmpty = false } = options;

  if (!email || email.trim() === "") {
    if (required && !allowEmpty) {
      errors.push("Email is required");
    }
    return { isValid: errors.length === 0, errors };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    errors.push("Please enter a valid email address");
  }

  // Length check
  if (email.length > 320) {
    // RFC 5321 limit
    errors.push("Email address is too long");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate password
 */
export function validatePassword(
  password: string,
  options: PasswordValidationOptions = {},
): ValidationResult {
  const errors: string[] = [];
  const {
    required = true,
    minLength = AUTH_CONFIG.PASSWORD.MIN_LENGTH,
    maxLength = AUTH_CONFIG.PASSWORD.MAX_LENGTH,
  } = options;

  if (!password || password === "") {
    if (required) {
      errors.push("Password is required");
    }
    return { isValid: errors.length === 0, errors };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (password.length > maxLength) {
    errors.push(`Password must be no more than ${maxLength} characters long`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate name
 */
export function validateName(
  name: string,
  required: boolean = true,
): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim() === "") {
    if (required) {
      errors.push("Name is required");
    }
    return { isValid: errors.length === 0, errors };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 1) {
    errors.push("Name must be at least 1 character long");
  }

  if (trimmedName.length > 100) {
    errors.push("Name must be no more than 100 characters long");
  }

  // Basic name validation (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(trimmedName)) {
    errors.push(
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    );
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate token format
 */
export function validateToken(token: string): ValidationResult {
  const errors: string[] = [];

  if (!token || token.trim() === "") {
    errors.push("Token is required");
    return { isValid: false, errors };
  }

  // Basic token format validation (hex string, at least 32 characters)
  const tokenRegex = /^[a-f0-9]{32,}$/;
  if (!tokenRegex.test(token)) {
    errors.push("Invalid token format");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate sign up data
 */
export function validateSignUpData(data: {
  email: string;
  password: string;
  name: string;
}): ValidationResult {
  const allErrors: string[] = [];

  const emailResult = validateEmail(data.email);
  const passwordResult = validatePassword(data.password);
  const nameResult = validateName(data.name);

  allErrors.push(...emailResult.errors);
  allErrors.push(...passwordResult.errors);
  allErrors.push(...nameResult.errors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validate sign in data
 */
export function validateSignInData(data: {
  email: string;
  password: string;
}): ValidationResult {
  const allErrors: string[] = [];

  const emailResult = validateEmail(data.email);
  const passwordResult = validatePassword(data.password);

  allErrors.push(...emailResult.errors);
  allErrors.push(...passwordResult.errors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Throw validation error if data is invalid
 */
export function assertValid(result: ValidationResult): void {
  if (!result.isValid) {
    throw new ValidationError(result.errors.join(", "));
  }
}

/**
 * Sanitize email (trim and lowercase)
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitize name (trim and title case)
 */
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
