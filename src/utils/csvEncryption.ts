// Simple obfuscation/encryption for CSV data
// Uses Base64 + character shifting to make data not directly readable

const SHIFT_KEY = 7; // Character shift amount
const MAGIC_HEADER = 'OOPS_ENC_V1'; // Header to identify encrypted files

// Shift characters for basic obfuscation
function shiftChars(str: string, shift: number): string {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) + shift))
    .join('');
}

// Unshift characters
function unshiftChars(str: string, shift: number): string {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) - shift))
    .join('');
}

// Encrypt CSV content
export function encryptCSV(csvContent: string): string {
  try {
    // First Base64 encode
    const base64 = btoa(unescape(encodeURIComponent(csvContent)));
    // Then shift characters
    const shifted = shiftChars(base64, SHIFT_KEY);
    // Add magic header
    return `${MAGIC_HEADER}:${shifted}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    return csvContent;
  }
}

// Decrypt CSV content
export function decryptCSV(encryptedContent: string): string {
  try {
    // Check for magic header
    if (!encryptedContent.startsWith(MAGIC_HEADER + ':')) {
      // Not encrypted, return as-is (supports plain CSV import)
      return encryptedContent;
    }
    
    // Remove magic header
    const shifted = encryptedContent.slice(MAGIC_HEADER.length + 1);
    // Unshift characters
    const base64 = unshiftChars(shifted, SHIFT_KEY);
    // Decode Base64
    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    console.error('Decryption failed:', error);
    // If decryption fails, try returning as plain text (might be unencrypted)
    return encryptedContent;
  }
}

// Check if content is encrypted
export function isEncrypted(content: string): boolean {
  return content.startsWith(MAGIC_HEADER + ':');
}
