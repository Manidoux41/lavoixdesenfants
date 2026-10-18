"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/password";
import { db } from "@/lib/db";
import {
  createAdminSession,
  DUMMY_PASSWORD_HASH,
  destroyAdminSession,
  isLoginBlocked,
  recordFailedLogin,
  throttleKey,
  trustedClientId,
} from "@/lib/admin-auth";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(256),
});

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Adresse e-mail ou mot de passe invalide." };

  const email = parsed.data.email.toLowerCase();
  const headerStore = await headers();
  const key = throttleKey(email, trustedClientId(headerStore.get("x-vercel-forwarded-for")));
  if (await isLoginBlocked(key)) {
    return { error: "Adresse e-mail ou mot de passe invalide." };
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  const expectedHash = user?.passwordHash ?? await DUMMY_PASSWORD_HASH;
  const passwordIsValid = await verifyPassword(parsed.data.password, expectedHash);
  if (!user || !passwordIsValid) {
    await recordFailedLogin(key);
    return { error: "Adresse e-mail ou mot de passe invalide." };
  }

  await db.loginThrottle.deleteMany({ where: { id: key } });
  await createAdminSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
