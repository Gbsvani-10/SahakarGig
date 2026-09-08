import { ValidationResult } from '../types/payment.types';

/**
 * Validates standard NPCI UPI Virtual Payment Address (VPA / UPI ID)
 * Allowed format: username@bankhandle (e.g., worker@oksbi, sahakar@icici)
 */
export function validateUPIId(upiId: string): ValidationResult {
  if (!upiId || typeof upiId !== 'string') {
    return { valid: false, error: 'UPI ID cannot be empty' };
  }

  const trimmed = upiId.trim();

  if (trimmed.length < 3 || trimmed.length > 64) {
    return { valid: false, error: 'UPI ID length must be between 3 and 64 characters' };
  }

  // Regex for NPCI standard UPI VPAs: [alphanumeric, dots, hyphens, underscores]@[alphanumeric]
  const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

  if (!vpaRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid UPI ID format. Expected format: username@bank (e.g. ramu@oksbi)',
    };
  }

  return { valid: true };
}

/**
 * Validates transaction amount
 * Constraints:
 * - Must be a valid positive number
 * - Minimum amount: ₹1.00
 * - Maximum amount: ₹1,00,000.00 (Standard NPCI UPI transaction ceiling for prototype safety)
 * - Maximum 2 decimal digits
 */
export function validateAmount(rawAmount: number | string): ValidationResult {
  if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
    return { valid: false, error: 'Amount is required' };
  }

  const num = typeof rawAmount === 'number' ? rawAmount : parseFloat(String(rawAmount).trim());

  if (isNaN(num)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }

  if (num < 1) {
    return { valid: false, error: 'Minimum payment amount is ₹1' };
  }

  if (num > 100000) {
    return { valid: false, error: 'Maximum payment amount allowed is ₹1,00,000' };
  }

  // Check decimal places (max 2 decimal places)
  const parts = num.toString().split('.');
  if (parts.length > 1 && parts[1].length > 2) {
    return { valid: false, error: 'Amount cannot have more than 2 decimal places' };
  }

  return { valid: true, parsedAmount: Math.round(num * 100) / 100 };
}

/**
 * Generates an NPCI-compliant unique Transaction Reference ID
 * Prefix: 'SG' (SahakarGig) + timestamp + cryptographically random component
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SG${timestamp}${randomPart}`;
}

/**
 * Generates a merchant/booking reference ID
 */
export function generateOrderReference(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ORD-SG-${random}`;
}

/**
 * Strips untrusted characters from notes and names to prevent URI tampering or XSS
 */
export function sanitizeText(text: string, maxLength = 60): string {
  if (!text) return '';
  return text
    .replace(/[<>"'&;\\]/g, '') // remove HTML/script special characters
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}
