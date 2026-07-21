import { cookies } from "next/headers";
import { verifyToken, type AdminPayload } from "@/lib/auth";

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) return null;

  return verifyToken(token);
}
