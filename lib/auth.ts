import { getIronSession } from "iron-session";
import type { IronSessionData } from "iron-session";
import { cookies } from "next/headers";
import * as crypto from "crypto";

declare module "iron-session" {
  interface IronSessionData {
    userId?: number;
    username?: string;
  }
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "bopherz_dev_secret_2026_min_32_chars!!",
  cookieName: "bopherz_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<IronSessionData>(cookieStore, sessionOptions);
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "bopherz_salt_2026").digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
