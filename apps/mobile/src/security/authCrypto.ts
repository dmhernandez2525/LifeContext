import * as Crypto from 'expo-crypto';

const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
};

export const generateSalt = async (): Promise<string> => {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return bytesToHex(bytes);
};

export const hashWithSalt = async (value: string, salt: string): Promise<string> => {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${value}`);
};

export const generateAuthToken = (): string => {
  return Crypto.randomUUID();
};
