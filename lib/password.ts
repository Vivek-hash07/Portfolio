import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SCRYPT = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
} as const;

function deriveKey(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      SCRYPT.dkLen,
      {
        N: SCRYPT.N,
        r: SCRYPT.r,
        p: SCRYPT.p,
        maxmem: 128 * SCRYPT.N * SCRYPT.r * 2,
      },
      (error, key) => {
        if (error) reject(error);
        else resolve(key);
      },
    );
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, key] = passwordHash.split(":");
  if (!salt || !key) return false;

  const actual = await deriveKey(password, salt);
  const expected = Buffer.from(key, "hex");

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
