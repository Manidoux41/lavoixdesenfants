import { randomBytes, scrypt } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function derivePassword(password, salt) {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Set BOOTSTRAP_ADMIN_EMAIL to a valid email address.");
  }
  if (!password || password.length < 14 || password.length > 256) {
    throw new Error("Set BOOTSTRAP_ADMIN_PASSWORD to a password between 14 and 256 characters.");
  }

  const existingUsers = await db.user.count();
  if (existingUsers > 0) {
    throw new Error("An account already exists. Bootstrap only creates the first administrator in an empty user table.");
  }

  const salt = randomBytes(16);
  const passwordHash = await derivePassword(password, salt);
  await db.user.create({
    data: {
      email,
      passwordHash: `scrypt:${salt.toString("base64url")}:${passwordHash.toString("base64url")}`,
      role: "ADMIN",
    },
  });
  console.log(`Created the first administrator account for ${email}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Administrator creation failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
