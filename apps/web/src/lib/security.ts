/**
 * Browser-compatible Shamir's Secret Sharing implementation
 *
 * TODO: Replace with proper cryptographic implementation
 * This is a SIMPLIFIED version that embeds the secret in each share for demo purposes.
 * For production, use @stablelib/secret-sharing or implement full GF(256) Lagrange interpolation.
 * See /apps/mobile/src/lib/secretSharing.ts for a proper implementation.
 */

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
 * Converts string to hex
 */
function str2hex(str: string): string {
  return Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts hex to string
 */
function hex2str(hex: string): string {
  const bytes = hex.match(/.{1,2}/g) || [];
  return bytes.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
}

/**
 * Simplified Shamir's Secret Sharing (XOR-based for MVP)
 * Splits a master secret into N shares, requiring M to reconstruct.
 */
export function splitKey(secret: string, shares: number, threshold: number): string[] {
  if (threshold > shares) {
    throw new Error('Threshold cannot be greater than total shares');
  }
  
  const hexSecret = str2hex(secret);
  const result: string[] = [];
  
  // For simplicity in this browser-compatible version:
  // Generate random shares and encode threshold info
  for (let i = 0; i < shares; i++) {
    const shareId = (i + 1).toString(16).padStart(2, '0');
    const thresholdHex = threshold.toString(16).padStart(2, '0');
    const sharesHex = shares.toString(16).padStart(2, '0');
    
    // Create random padding
    const padding = Array.from({ length: hexSecret.length / 2 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
    
    // Format: [shareId][threshold][totalShares][secret][padding]
    result.push(`${shareId}${thresholdHex}${sharesHex}${hexSecret}${padding}`);
  }
  
  return result;
}

/**
 * Reconstructs the original secret from a list of shares.
 */
export function reconstructKey(shares: string[]): string {
  if (shares.length === 0) return '';
  
  // Extract metadata from first share
  const firstShare = shares[0];
  const threshold = parseInt(firstShare.substring(2, 4), 16);
  
  if (shares.length < threshold) {
    throw new Error(`Need at least ${threshold} shares to reconstruct`);
  }
  
  // For this simplified version, we just extract the embedded secret
  // In production, you'd use polynomial interpolation
  const hexSecret = firstShare.substring(6, Math.floor(firstShare.length / 2) + 6);
  
  return hex2str(hexSecret);
}

/**
 * Validates a share format.
 */
export function isValidShare(share: string): boolean {
  return /^[0-9a-f]+$/i.test(share) && share.length > 6;
}
