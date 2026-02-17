/**
 * WebAuthn/Passkey utilities for passwordless authentication.
 * Wraps the Web Authentication API for credential registration and verification.
 */

const RP_NAME = 'LifeContext';
const RP_ID_FALLBACK = 'localhost';

function getRpId(): string {
  if (typeof window === 'undefined') return RP_ID_FALLBACK;
  return window.location.hostname || RP_ID_FALLBACK;
}

export interface StoredCredential {
  id: string;
  rawId: string; // base64
  publicKey: string; // base64 SPKI
  createdAt: number;
  label: string;
  lastUsed: number;
}

/** Check if WebAuthn is available in the current browser. */
export function isWebAuthnAvailable(): boolean {
  return typeof window !== 'undefined'
    && typeof window.PublicKeyCredential !== 'undefined'
    && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function';
}

/** Check if a platform authenticator (biometric/PIN) is available. */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnAvailable()) return false;
  return window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

/**
 * Register a new WebAuthn credential (passkey).
 */
export async function registerCredential(
  userId: string,
  userName: string,
  label: string,
  existingCredentialIds: string[] = []
): Promise<StoredCredential> {
  const challenge = generateChallenge();

  const excludeCredentials: PublicKeyCredentialDescriptor[] = existingCredentialIds.map(id => ({
    id: base64ToBuffer(id),
    type: 'public-key',
    transports: ['internal', 'hybrid'] as AuthenticatorTransport[],
  }));

  const options: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: RP_NAME,
      id: getRpId(),
    },
    user: {
      id: new TextEncoder().encode(userId),
      name: userName,
      displayName: userName,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },   // ES256
      { alg: -257, type: 'public-key' },  // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'preferred',
      residentKey: 'preferred',
      requireResidentKey: false,
    },
    timeout: 60000,
    attestation: 'none',
    excludeCredentials,
  };

  const credential = await navigator.credentials.create({
    publicKey: options,
  }) as PublicKeyCredential;

  if (!credential) {
    throw new Error('Credential creation was cancelled or failed');
  }

  const response = credential.response as AuthenticatorAttestationResponse;

  // Extract public key for future verification
  const publicKeyBytes = response.getPublicKey();
  if (!publicKeyBytes) {
    throw new Error('Could not extract public key from credential');
  }

  return {
    id: credential.id,
    rawId: bufferToBase64(credential.rawId),
    publicKey: bufferToBase64(publicKeyBytes),
    createdAt: Date.now(),
    label,
    lastUsed: Date.now(),
  };
}

/**
 * Authenticate using a stored WebAuthn credential.
 * Returns the credential ID that was used.
 */
export async function authenticateCredential(
  allowedCredentials: StoredCredential[]
): Promise<string> {
  const challenge = generateChallenge();

  const allowCredentials: PublicKeyCredentialDescriptor[] = allowedCredentials.map(cred => ({
    id: base64ToBuffer(cred.rawId),
    type: 'public-key',
    transports: ['internal', 'hybrid'] as AuthenticatorTransport[],
  }));

  const options: PublicKeyCredentialRequestOptions = {
    challenge,
    rpId: getRpId(),
    allowCredentials,
    userVerification: 'preferred',
    timeout: 60000,
  };

  const assertion = await navigator.credentials.get({
    publicKey: options,
  }) as PublicKeyCredential;

  if (!assertion) {
    throw new Error('Authentication was cancelled or failed');
  }

  return assertion.id;
}
