import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, bookings } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json() as { status: "approved" | "rejected"; adminNote?: string };

    const updates: Partial<typeof bookings.$inferInsert> = {
      status: body.status,
    };
    if (body.adminNote !== undefined) updates.adminNote = body.adminNote;

    const [updated] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, Number(id)))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...updated, submittedAt: updated.submittedAt.toISOString() });
  } catch (error) {
    console.error("Update booking status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
