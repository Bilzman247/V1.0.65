/**
 * PKCE Cryptographic Helpers for OAuth 2.0 PKCE Flow
 */

// Generate random string using Web Crypto API
export function generateRandomString(length: number = 64): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = new Uint8Array(length);

  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure random number generation is not available in this browser.');
  }
  globalThis.crypto.getRandomValues(values);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

// Generate code verifier (standard PKCE: 43 to 128 characters)
export function generateCodeVerifier(length: number = 64): string {
  return generateRandomString(Math.min(128, Math.max(43, length)));
}

// Generate code challenge from verifier using SHA-256 and base64url encoding
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure SHA-256 is not available in this browser.');
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);

  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // Base64url encoding: replace '+' with '-', '/' with '_', and remove '='
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Generate state parameter for CSRF mitigation
export function generateState(length: number = 32): string {
  return generateRandomString(length);
}
