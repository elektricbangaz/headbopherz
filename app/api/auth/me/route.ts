import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, adminUsers } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, session.userId));
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ username: user.username, isAdmin: true });
}
