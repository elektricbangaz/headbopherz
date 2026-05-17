import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyPassword } from "@/lib/auth";
import { db, adminUsers } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    await session.save();

    return NextResponse.json({ username: user.username, isAdmin: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
