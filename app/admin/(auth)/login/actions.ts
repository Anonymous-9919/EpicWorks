"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const user = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (user.length === 0) {
      return { error: "Invalid email or password" };
    }

    const valid = await verifyPassword(password, user[0].passwordHash);
    if (!valid) {
      return { error: "Invalid email or password" };
    }

    const token = await createToken({
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch (e) {
    console.error("Login action failed:", e);
    return { error: "Login failed. Please try again." };
  }

  redirect("/admin");
}
