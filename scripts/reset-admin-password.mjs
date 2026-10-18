import { randomBytes, scrypt } from "node:crypto";
import { PrismaClient, UserRole } from "@prisma/client";

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
  const email = process.env.ADMIN_PASSWORD_RESET_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD_RESET_PASSWORD;

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Set ADMIN_PASSWORD_RESET_EMAIL to a valid administrator email.");
  }
  if (!password || password.length < 14 || password.length > 256) {
    throw new Error("Set ADMIN_PASSWORD_RESET_PASSWORD to a password between 14 and 256 characters.");
  }

  const admin = await db.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });
  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new Error("No administrator account was found for the configured email.");
  }

  const salt = randomBytes(16);
  const passwordHash = await derivePassword(password, salt);
  await db.$transaction([
    db.user.update({
      where: { id: admin.id },
      data: { passwordHash: `scrypt:${salt.toString("base64url")}:${passwordHash.toString("base64url")}` },
    }),
    db.session.deleteMany({ where: { userId: admin.id } }),
  ]);

  console.log("Administrator password updated and existing sessions revoked.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Administrator password reset failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
