/**
 * Mobile Encryption Utilities
 * Uses expo-crypto for cryptographic operations
 * Compatible with web encryption format
 */
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

// ============================================================
// KEY MANAGEMENT
// ============================================================

const KEY_STORAGE_KEY = 'lcc_encryption_key';

/**
 * Get or create encryption key
 * Stored securely in device keychain
 */
export async function getEncryptionKey(): Promise<string> {
  let key = await SecureStore.getItemAsync(KEY_STORAGE_KEY);
  
  if (!key) {
    // Generate new 256-bit key
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    key = bytesToHex(randomBytes);
    await SecureStore.setItemAsync(KEY_STORAGE_KEY, key);
  }
  
  return key;
}

/**
 * Clear encryption key (for reset/logout)
 */
export async function clearEncryptionKey(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_STORAGE_KEY);
}

/**
 * Check if encryption key exists
 */
export async function hasEncryptionKey(): Promise<boolean> {
  const key = await SecureStore.getItemAsync(KEY_STORAGE_KEY);
  return key !== null;
}

// ============================================================
// ENCRYPTION OPERATIONS
// ============================================================

/**
 * Encrypt data using AES-256
 * Note: expo-crypto doesn't support AES directly, so we use a simple XOR cipher
 * with SHA-256 derived key for demo purposes. In production, use a native module.
 */
export async function encryptData(
  data: string,
  key?: string
): Promise<{ encrypted: string; iv: string }> {
  const encryptionKey = key || await getEncryptionKey();
  
  // Generate IV
  const ivBytes = await Crypto.getRandomBytesAsync(16);
  const iv = bytesToHex(ivBytes);
  
  // Derive key using SHA-256
  const derivedKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    encryptionKey + iv
  );
  
  // Simple XOR encryption (for demo - production should use native AES)
  const dataBytes = stringToBytes(data);
  const keyBytes = hexToBytes(derivedKey);
  const encrypted = new Uint8Array(dataBytes.length);
  
  for (let i = 0; i < dataBytes.length; i++) {
    encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return {
    encrypted: bytesToBase64(encrypted),
    iv,
  };
}

/**
 * Decrypt data
 */
export async function decryptData(
  encryptedData: string,
  iv: string,
  key?: string
): Promise<string> {
  const encryptionKey = key || await getEncryptionKey();
  
  // Derive key using SHA-256
  const derivedKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    encryptionKey + iv
  );
  
  // XOR decryption
  const encryptedBytes = base64ToBytes(encryptedData);
  const keyBytes = hexToBytes(derivedKey);
  const decrypted = new Uint8Array(encryptedBytes.length);
  
  for (let i = 0; i < encryptedBytes.length; i++) {
    decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return bytesToString(decrypted);
}

// ============================================================
// HASHING
// ============================================================

/**
 * Generate SHA-256 hash
 */
export async function sha256(data: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
}

/**
 * Generate random UUID
 */
export function generateId(): string {
  return Crypto.randomUUID();
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function stringToBytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

function bytesToString(bytes: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
