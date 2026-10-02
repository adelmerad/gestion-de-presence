"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appPassword, SESSION_COOKIE, SESSION_MAX_AGE, sessionToken } from "@/lib/auth";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const password = appPassword();
  const attempt = String(formData.get("password") ?? "");

  if (!password || (await sessionToken(attempt)) !== (await sessionToken(password))) {
    return "Mot de passe incorrect.";
  }

  (await cookies()).set(SESSION_COOKIE, await sessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  redirect("/");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
