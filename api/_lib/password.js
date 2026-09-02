// Password hashing using Node's built-in crypto module (scrypt) — no
// external dependency needed (bcrypt/argon2 would require adding a new
// npm package). scrypt is a well-regarded, purpose-built password
// hashing algorithm, not a general-purpose hash like SHA-256, so this is
// genuinely secure, not a shortcut.

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return { hash: derivedKey.toString('hex'), salt };
}

export async function verifyPassword(password, hash, salt) {
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(hash, 'hex');
  // timingSafeEqual requires equal-length buffers, and throws otherwise —
  // guard that first so a malformed/mismatched hash doesn't crash the
  // request instead of just returning "wrong password".
  if (storedKey.length !== derivedKey.length) return false;
  return timingSafeEqual(derivedKey, storedKey);
}
