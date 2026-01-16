/**
 * Shamir's Secret Sharing Implementation (GF(256))
 * Allows splitting a secret string into N shares, requiring M to reconstruct.
 */

import { getRandomBytes } from 'expo-crypto';

// Primitive polynomial for GF(256) = x^8 + x^4 + x^3 + x + 1 (0x11B)
// Used in Rijndael / AES
const PRIMITIVE = 0x11B;

// Logs and Exponents tables
const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);

// Initialize GF Tables
(() => {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        EXP[i] = x;
        LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= PRIMITIVE;
    }
    // LOG[0] is undefined/unused
})();

function mul(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    let log = LOG[a] + LOG[b];
    if (log >= 255) log -= 255;
    return EXP[log];
}
function div(a: number, b: number): number {
    if (b === 0) throw new Error("Division by zero");
    if (a === 0) return 0;
    let log = LOG[a] - LOG[b];
    if (log < 0) log += 255;
    return EXP[log];
}

// Evaluate polynomial at x
function evalPoly(poly: Uint8Array, x: number): number {
    let y = 0;
    for (let i = poly.length - 1; i >= 0; i--) {
        y = mul(y, x) ^ poly[i];
    }
    return y;
}

/**
 * Splits a HEX secret string into N shares, with threshold M.
 * @returns Array of shares string "shareIndex-hexData"
 */
export function split(secretHex: string, n: number, m: number): string[] {
    if (m > n) throw new Error("Threshold cannot be greater than shares");
    if (m < 2) throw new Error("Threshold must be at least 2");

    // Convert hex to bytes
    const secretBytes = new Uint8Array(secretHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const secretLen = secretBytes.length;

    // We generate a polynomial for EACH byte of the secret
    // intercept = secret byte
    // m-1 random coefficients
    
    // Structure: Share i = index byte + (calculated bytes for each secret byte)
    const shares: Uint8Array[] = Array.from({ length: n }, () => new Uint8Array(secretLen));

    for (let i = 0; i < secretLen; i++) {
        // Create polynomial for this byte
        const poly = new Uint8Array(m);
        poly[0] = secretBytes[i]; // Intercept
        
        // Random coefficients
        const randomBytes = getRandomBytes(m - 1);
        for (let j = 1; j < m; j++) {
            poly[j] = randomBytes[j-1];
        }

        // Evaluate for each share (x = 1 to n)
        for (let x = 1; x <= n; x++) {
            shares[x-1][i] = evalPoly(poly, x);
        }
    }

    // Format: "index-hexdata"
    return shares.map((s, idx) => {
        const hex = Array.from(s).map(b => b.toString(16).padStart(2, '0')).join('');
        return `${idx + 1}-${hex}`;
    });
}

/**
 * Reconstructs a secret from an array of shares ("index-hexdata").
 */
export function combine(shares: string[]): string | null {
    if (shares.length < 2) return null;

    try {
        const samples = shares.map(s => {
            const [idxStr, dataHex] = s.split('-');
            const x = parseInt(idxStr, 10);
            const y = new Uint8Array(dataHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
            return { x, y };
        });

        const secretLen = samples[0].y.length;
        const secret = new Uint8Array(secretLen);

        // Lagrange Interpolation for x=0 (the secret)
        for (let i = 0; i < secretLen; i++) {
            let result = 0;
            
            for (let j = 0; j < samples.length; j++) {
                const xj = samples[j].x;
                const yj = samples[j].y[i];
                
                let basis = 1;
                for (let k = 0; k < samples.length; k++) {
                    if (j === k) continue;
                    const xk = samples[k].x;
                    
                    // basis *= xk / (xk - xj)  in GF(256)
                    // xk - xj is actually xk ^ xj (addition/subtraction is XOR)
                    // limit: x=0
                    // term: (0 - xk) / (xj - xk) = xk / (xj + xk)
                    const num = xk;
                    const den = xj ^ xk;
                    basis = mul(basis, div(num, den));
                }
                
                result ^= mul(yj, basis);
            }
            secret[i] = result;
        }

        return Array.from(secret).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
        // Invalid shares or insufficient shares for reconstruction
        return null;
    }
}
