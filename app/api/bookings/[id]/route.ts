import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, bookings } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, Number(id)));
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...booking, submittedAt: booking.submittedAt.toISOString() });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { eventType, eventDate, endDate, venue, guestCount, notes, adminNote, estimatedValue } = body;

    const updates: Partial<typeof bookings.$inferInsert> = {};
    if (eventType !== undefined) updates.eventType = eventType;
    if (eventDate !== undefined) updates.eventDate = eventDate;
    if (endDate !== undefined) updates.endDate = endDate;
    if (venue !== undefined) updates.venue = venue;
    if (guestCount !== undefined) updates.guestCount = Number(guestCount);
    if (notes !== undefined) updates.notes = notes;
    if (adminNote !== undefined) updates.adminNote = adminNote;
    if (estimatedValue !== undefined) updates.estimatedValue = estimatedValue ? Number(estimatedValue) : null;

    const [updated] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, Number(id)))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...updated, submittedAt: updated.submittedAt.toISOString() });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.delete(bookings).where(eq(bookings.id, Number(id)));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
