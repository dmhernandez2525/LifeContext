// @ts-ignore
import secrets from 'secrets.js-grempe';

export interface KeyShare {
  id: string; // The hex share
  label?: string; // e.g. "Attorney", "Safe Deposit Box"
}

export const SECURITY_CONFIG = {
  MIN_SHARES: 2,
  MAX_SHARES: 20,
  DEFAULT_SHARES: 5,
  DEFAULT_THRESHOLD: 3,
};

/**
 * Splits a master secret (e.g., encryption key or password) into N shares, 
 * requiring M to reconstruct.
 * @param secret The hex string of the secret to split
 * @param shares Total number of shares to generate (N)
 * @param threshold Number of shares required to unlock (M)
 */
export function splitStartKey(secret: string, shares: number, threshold: number): string[] {
  // Ensure secret is hex. If it's a raw string, convert to hex first.
  const hexSecret = secrets.str2hex(secret);
  return secrets.share(hexSecret, shares, threshold);
}

/**
 * Reconstructs the original secret from a list of shares.
 * @param shares Array of hex share strings
 */
export function reconstructKey(shares: string[]): string {
  if (shares.length === 0) return '';
  const hexSecret = secrets.combine(shares);
  return secrets.hex2str(hexSecret);
}

/**
 * Validates a share format.
 * Shamir shares in this lib are hex strings usually starting with the bit-width (8) and id.
 */
export function isValidShare(share: string): boolean {
  return /^[0-9a-f]+$/i.test(share) && share.length > 2;
}
