import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, clients, bookings } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const [client] = await db.select().from(clients).where(eq(clients.id, Number(id)));
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const clientBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.clientId, client.id))
      .orderBy(sql`${bookings.submittedAt} desc`);

    return NextResponse.json({
      ...client,
      createdAt: client.createdAt.toISOString(),
      bookings: clientBookings.map((b) => ({ ...b, submittedAt: b.submittedAt.toISOString() })),
    });
  } catch (error) {
    console.error("Get client error:", error);
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
    const { name, company, email, phone } = await req.json();
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (company !== undefined) updates.company = company;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;

    const [updated] = await db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, Number(id)))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...updated, totalBookings: 0, createdAt: updated.createdAt.toISOString() });
  } catch (error) {
    console.error("Update client error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
