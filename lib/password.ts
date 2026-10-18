import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

function derivePassword(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function createPasswordHash(password: string) {
  const salt = randomBytes(16);
  const derived = await derivePassword(password, salt);
  return `scrypt:${salt.toString("base64url")}:${derived.toString("base64url")}`;
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, salt, expected] = encodedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !expected) return false;

  const expectedHash = Buffer.from(expected, "base64url");
  if (expectedHash.length !== 64) return false;
  const actualHash = await derivePassword(password, Buffer.from(salt, "base64url"));
  return timingSafeEqual(expectedHash, actualHash);
}
