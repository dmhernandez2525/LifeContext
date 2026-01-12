/**
 * @lcc/encryption
 * 
 * Client-side encryption using AES-256-GCM with PBKDF2 key derivation.
 * All encryption/decryption happens in the browser - data is never sent unencrypted.
 */

import type { EncryptedData, EncryptionMeta, PrivacyLevel } from '@lcc/types';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const ITERATIONS = 100000;
const SALT_LENGTH = 32;
const IV_LENGTH = 12;

/**
 * Generate cryptographically secure random bytes
 */
function getRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Convert Uint8Array to base64 string
 */
function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Convert base64 string to Uint8Array
 */
function fromBase64(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

/**
 * Generate a new salt for key derivation
 */
export function generateSalt(): string {
  return toBase64(getRandomBytes(SALT_LENGTH));
}

/**
 * Create encryption metadata with a new salt
 */
export function createEncryptionMeta(): EncryptionMeta {
  return {
    salt: generateSalt(),
    iterations: ITERATIONS,
    createdAt: new Date(),
  };
}

/**
 * Derive an encryption key from a passcode using PBKDF2
 * 
 * @param passcode - User's passcode/password
 * @param salt - Base64 encoded salt
 * @returns CryptoKey for encryption/decryption
 */
export async function deriveKey(
  passcode: string,
  salt: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const saltBytes = fromBase64(salt);
  
  // Import passcode as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passcode),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive the actual encryption key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false, // Non-extractable for security
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive a privacy-level specific key from the master key
 * Each privacy level gets its own derived key
 * 
 * @param masterKey - The key derived from user's passcode
 * @param privacyLevel - The privacy level (0-5)
 * @returns CryptoKey for the specific privacy level
 */
export async function derivePrivacyKey(
  masterKey: CryptoKey,
  privacyLevel: PrivacyLevel
): Promise<CryptoKey> {
  // Export the master key bits
  const masterBits = await crypto.subtle.exportKey('raw', masterKey);
  
  // Create a privacy-level specific salt
  const encoder = new TextEncoder();
  const privacySalt = encoder.encode(`privacy-level-${privacyLevel}`);
  
  // Re-import as key material for HKDF
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    masterBits,
    'HKDF',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive privacy-specific key
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new Uint8Array(0),
      info: privacySalt,
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-256-GCM
 * 
 * @param data - Plain text to encrypt
 * @param key - CryptoKey for encryption
 * @returns EncryptedData object with IV, ciphertext, and auth tag
 */
export async function encrypt(
  data: string,
  key: CryptoKey
): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const iv = getRandomBytes(IV_LENGTH);
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
    },
    key,
    encoder.encode(data)
  );
  
  // AES-GCM includes the auth tag in the output
  // The last 16 bytes are the auth tag
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const ciphertext = encryptedArray.slice(0, -16);
  const authTag = encryptedArray.slice(-16);
  
  return {
    version: 1,
    algorithm: 'AES-256-GCM',
    iv: toBase64(iv),
    data: toBase64(ciphertext),
    authTag: toBase64(authTag),
  };
}

/**
 * Decrypt data using AES-256-GCM
 * 
 * @param encrypted - EncryptedData object
 * @param key - CryptoKey for decryption
 * @returns Decrypted plain text
 * @throws Error if decryption fails (wrong key, tampered data)
 */
export async function decrypt(
  encrypted: EncryptedData,
  key: CryptoKey
): Promise<string> {
  const iv = fromBase64(encrypted.iv);
  const ciphertext = fromBase64(encrypted.data);
  const authTag = fromBase64(encrypted.authTag);
  
  // Combine ciphertext and auth tag for decryption
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);
  
  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      combined
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Decryption failed - incorrect passcode or corrupted data');
  }
}

/**
 * Test if a passcode can decrypt the given encrypted data
 * Useful for passcode verification
 * 
 * @param encrypted - EncryptedData to test
 * @param passcode - Passcode to test
 * @param salt - Salt used for key derivation
 * @returns true if passcode is correct, false otherwise
 */
export async function verifyPasscode(
  encrypted: EncryptedData,
  passcode: string,
  salt: string
): Promise<boolean> {
  try {
    const key = await deriveKey(passcode, salt);
    await decrypt(encrypted, key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Hash a passcode for storage (NOT the encryption key)
 * This is used to quickly verify if the passcode is correct
 * before attempting expensive decryption operations
 * 
 * @param passcode - User's passcode
 * @param salt - Salt for hashing
 * @returns Base64 encoded hash
 */
export async function hashPasscode(
  passcode: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(passcode + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return toBase64(new Uint8Array(hashBuffer));
}

/**
 * Encrypt an object (serializes to JSON first)
 */
export async function encryptObject<T>(
  obj: T,
  key: CryptoKey
): Promise<EncryptedData> {
  const json = JSON.stringify(obj);
  return encrypt(json, key);
}

/**
 * Decrypt an object (parses JSON after decryption)
 */
export async function decryptObject<T>(
  encrypted: EncryptedData,
  key: CryptoKey
): Promise<T> {
  const json = await decrypt(encrypted, key);
  return JSON.parse(json) as T;
}
