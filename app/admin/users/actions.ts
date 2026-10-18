"use server";

import { Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";
import { digestSessionToken, requireAdministrator } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { createPasswordHash, verifyPassword } from "@/lib/password";

const roles = [UserRole.USER, UserRole.CONTRIBUTOR, UserRole.ADMIN] as const;

const accountSchema = z.object({
  name: z.string().trim().max(100),
  email: z.email().trim().max(254),
  role: z.enum(roles),
});

function revalidateUsers() {
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createUserAction(formData: FormData) {
  await requireAdministrator();
  const parsed = accountSchema.extend({
    password: z.string().min(14).max(256),
  }).safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/admin/users?error=create-invalid");

  const { password, ...account } = parsed.data;
  try {
    await db.user.create({
      data: {
        ...account,
        email: account.email.toLowerCase(),
        name: account.name || null,
        passwordHash: await createPasswordHash(password),
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) redirect("/admin/users?error=email-exists");
    throw error;
  }

  revalidateUsers();
  redirect("/admin/users?success=user-created");
}

export async function updateUserAction(formData: FormData) {
  const actor = await requireAdministrator();
  const parsed = accountSchema.extend({
    id: z.string().min(1).max(64),
  }).safeParse({
    id: formData.get("id"),
    name: formData.get("name") ?? "",
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) redirect("/admin/users?error=update-invalid");

  const { id, name, email, role } = parsed.data;
  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });
  if (!target) redirect("/admin/users?error=user-not-found");
  if (id === actor.id && target.role !== role) redirect("/admin/users?error=self-role");

  try {
    await db.$transaction(async (tx) => {
      if (target.role === UserRole.ADMIN && role !== UserRole.ADMIN) {
        const adminCount = await tx.user.count({ where: { role: UserRole.ADMIN } });
        if (adminCount <= 1) throw new Error("LAST_ADMINISTRATOR");
      }
      await tx.user.update({
        where: { id },
        data: { name: name || null, email: email.toLowerCase(), role },
      });
      if (target.role !== role) {
        await tx.session.deleteMany({ where: { userId: id } });
      }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof Error && error.message === "LAST_ADMINISTRATOR") {
      redirect("/admin/users?error=last-admin");
    }
    if (isUniqueConflict(error)) redirect("/admin/users?error=email-exists");
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      redirect("/admin/users?error=concurrent-change");
    }
    throw error;
  }

  revalidateUsers();
  redirect("/admin/users?success=user-updated");
}

export async function deleteUserAction(formData: FormData) {
  const actor = await requireAdministrator();
  const id = z.string().min(1).max(64).parse(formData.get("id"));
  if (id === actor.id) redirect("/admin/users?error=self-delete");

  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });
  if (!target) redirect("/admin/users?error=user-not-found");

  try {
    await db.$transaction(async (tx) => {
      if (target.role === UserRole.ADMIN) {
        const adminCount = await tx.user.count({ where: { role: UserRole.ADMIN } });
        if (adminCount <= 1) throw new Error("LAST_ADMINISTRATOR");
      }
      await tx.article.updateMany({ where: { authorId: id }, data: { authorId: actor.id } });
      await tx.media.updateMany({ where: { uploadedById: id }, data: { uploadedById: actor.id } });
      await tx.user.delete({ where: { id } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof Error && error.message === "LAST_ADMINISTRATOR") {
      redirect("/admin/users?error=last-admin");
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      redirect("/admin/users?error=concurrent-change");
    }
    throw error;
  }

  revalidateUsers();
  revalidatePath("/admin/articles");
  redirect("/admin/users?success=user-deleted");
}

const passwordSchema = z.object({
  password: z.string().min(14).max(256),
  confirmation: z.string().min(14).max(256),
}).refine(({ password, confirmation }) => password === confirmation);

export async function changeOwnPasswordAction(formData: FormData) {
  const admin = await requireAdministrator();
  const parsed = z.object({
    currentPassword: z.string().min(1).max(256),
    password: z.string().min(14).max(256),
    confirmation: z.string().min(14).max(256),
  }).refine(({ password, confirmation }) => password === confirmation).safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) redirect("/admin/users?error=password-invalid");

  const account = await db.user.findUniqueOrThrow({
    where: { id: admin.id },
    select: { passwordHash: true },
  });
  if (!await verifyPassword(parsed.data.currentPassword, account.passwordHash)) {
    redirect("/admin/users?error=current-password-invalid");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("lv_admin_session")?.value;
  if (!token) redirect("/admin/login");
  const currentTokenHash = digestSessionToken(token);
  await db.$transaction([
    db.user.update({
      where: { id: admin.id },
      data: { passwordHash: await createPasswordHash(parsed.data.password) },
    }),
    db.session.deleteMany({
      where: { userId: admin.id, tokenHash: { not: currentTokenHash } },
    }),
  ]);

  revalidateUsers();
  redirect("/admin/users?success=password-changed");
}

export async function resetUserPasswordAction(formData: FormData) {
  const admin = await requireAdministrator();
  const parsed = passwordSchema.extend({
    id: z.string().min(1).max(64),
  }).safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) redirect("/admin/users?error=password-invalid");
  if (parsed.data.id === admin.id) redirect("/admin/users?error=self-password-reset");
  const target = await db.user.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
  if (!target) redirect("/admin/users?error=user-not-found");

  await db.$transaction([
    db.user.update({
      where: { id: parsed.data.id },
      data: { passwordHash: await createPasswordHash(parsed.data.password) },
    }),
    db.session.deleteMany({ where: { userId: parsed.data.id } }),
  ]);

  revalidateUsers();
  redirect("/admin/users?success=password-reset");
}
