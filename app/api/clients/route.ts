import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, clients, bookings } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db
      .select({
        id: clients.id,
        name: clients.name,
        company: clients.company,
        email: clients.email,
        phone: clients.phone,
        totalBookings: sql<number>`CAST(COUNT(${bookings.id}) AS INTEGER)`,
        createdAt: clients.createdAt,
      })
      .from(clients)
      .leftJoin(bookings, eq(bookings.clientId, clients.id))
      .groupBy(clients.id)
      .orderBy(sql`${clients.createdAt} desc`);

    return NextResponse.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (error) {
    console.error("List clients error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, company, email, phone } = await req.json();
    if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

    const [client] = await db
      .insert(clients)
      .values({ name, company: company || null, email, phone: phone || null })
      .returning();
    return NextResponse.json(
      { ...client, totalBookings: 0, createdAt: client.createdAt.toISOString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
