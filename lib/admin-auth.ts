import "server-only";

import { createHash, createHmac, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { createPasswordHash } from "@/lib/password";

type AdminRole = Exclude<UserRole, "USER">;

export const ADMIN_COOKIE_NAME = "lv_admin_session";
const SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
const THROTTLE_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: AdminRole;
};

function isAdminRole(role: UserRole): role is AdminRole {
  return role === UserRole.ADMIN || role === UserRole.CONTRIBUTOR;
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 bytes.");
  }
  return secret;
}

function digestSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function throttleKey(email: string, trustedClientId: string) {
  return createHmac("sha256", sessionSecret())
    .update(`${email.toLowerCase()}:${trustedClientId}`)
    .digest("hex");
}

export const DUMMY_PASSWORD_HASH = createPasswordHash("not-a-real-account-password");

export async function recordFailedLogin(key: string) {
  const now = new Date();
  const current = await db.loginThrottle.findUnique({ where: { id: key } });
  if (!current || current.windowStartedAt.getTime() <= now.getTime() - THROTTLE_WINDOW_MS) {
    await db.loginThrottle.upsert({
      where: { id: key },
      create: { id: key, attempts: 1, windowStartedAt: now },
      update: { attempts: 1, windowStartedAt: now, blockedUntil: null },
    });
    return;
  }

  const attempts = current.attempts + 1;
  await db.loginThrottle.update({
    where: { id: key },
    data: {
      attempts: { increment: 1 },
      blockedUntil: attempts >= MAX_LOGIN_ATTEMPTS
        ? new Date(now.getTime() + THROTTLE_WINDOW_MS)
        : null,
    },
  });
}

export async function isLoginBlocked(key: string) {
  const limit = await db.loginThrottle.findUnique({ where: { id: key } });
  return Boolean(limit?.blockedUntil && limit.blockedUntil > new Date());
}

export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  if (!process.env.DATABASE_URL) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.session.findFirst({
    where: {
      tokenHash: digestSessionToken(token),
      expiresAt: { gt: new Date() },
      user: { role: { in: [UserRole.ADMIN, UserRole.CONTRIBUTOR] } },
    },
    select: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  const user = session?.user;
  if (!user) return null;
  const role = user.role;
  if (!isAdminRole(role)) return null;
  return { id: user.id, name: user.name, email: user.email, role };
});

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdministrator() {
  const user = await requireAdminUser();
  if (user.role !== UserRole.ADMIN) redirect("/admin");
  return user;
}

export async function createAdminSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.session.create({
    data: { userId, tokenHash: digestSessionToken(token), expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: digestSessionToken(token) } });
  }
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function trustedClientId(forwardedClientId: string | null) {
  return forwardedClientId?.trim().slice(0, 128) || "unknown";
}
