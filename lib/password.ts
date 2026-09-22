import {
  hashPassword as hashWithBetterAuth,
  verifyPassword as verifyWithBetterAuth,
} from "better-auth/crypto";

export async function hashPassword(password: string) {
  return hashWithBetterAuth(password);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return verifyWithBetterAuth({ hash: passwordHash, password });
}
