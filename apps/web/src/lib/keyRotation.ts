/**
 * Key rotation utilities for periodically rotating encryption credentials.
 * Generates new salt, re-hashes passcode, and provides re-encryption helpers.
 */
import { generateSalt, hashPasscode, deriveKey, encrypt, decrypt } from '@lcc/encryption';
import type { EncryptedData } from '@lcc/types';

const SECURITY_STORAGE_KEY = 'lcc-security';
const MS_PER_DAY = 86_400_000;

export interface RotationResult {
  success: boolean;
  newSalt: string;
  newHash: string;
  rotatedAt: number;
  itemsReEncrypted: number;
}

/**
 * Rotate the passcode credentials (new salt + new hash).
 * Does NOT change the passcode itself, only regenerates the salt.
 */
export async function rotatePasscodeCredentials(passcode: string): Promise<RotationResult> {
  const newSalt = generateSalt();
  const newHash = await hashPasscode(passcode, newSalt);

  // Update stored security data
  const securityData = {
    salt: newSalt,
    hash: newHash,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(securityData));

  return {
    success: true,
    newSalt,
    newHash,
    rotatedAt: Date.now(),
    itemsReEncrypted: 0,
  };
}

/**
 * Re-encrypt a single piece of encrypted data with a new key.
 * Decrypts with old key, then encrypts with new key.
 */
export async function reEncryptItem(
  item: EncryptedData,
  oldPasscode: string,
  oldSalt: string,
  newPasscode: string,
  newSalt: string,
): Promise<EncryptedData> {
  const oldKey = await deriveKey(oldPasscode, oldSalt);
  const plaintext = await decrypt(item, oldKey);
  const newKey = await deriveKey(newPasscode, newSalt);
  return encrypt(plaintext, newKey);
}

/**
 * Check if key rotation is due based on the last rotation date and reminder interval.
 */
export function isRotationDue(lastRotation: number | null, reminderDays: number): boolean {
  if (!lastRotation) return true;
  const daysSince = (Date.now() - lastRotation) / MS_PER_DAY;
  return daysSince >= reminderDays;
}

/**
 * Get a human-readable description of when the last rotation occurred.
 */
export function getRotationAge(lastRotation: number | null): string {
  if (!lastRotation) return 'Never rotated';
  const days = Math.floor((Date.now() - lastRotation) / MS_PER_DAY);
  if (days === 0) return 'Rotated today';
  if (days === 1) return 'Rotated yesterday';
  if (days < 30) return `Rotated ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Rotated ${months} month${months > 1 ? 's' : ''} ago`;
}
