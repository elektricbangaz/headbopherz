import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, bookings, clients } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

function generateRef(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BPH-${year}-${num}`;
}

// POST: Public — submit a booking request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientCompany, clientEmail, clientPhone, eventType, eventDate, endDate, venue, guestCount, notes } = body;

    if (!clientName || !clientEmail || !clientPhone || !eventType || !eventDate || !venue || !guestCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find or create client
    let clientId: number | null = null;
    if (clientEmail) {
      const [existing] = await db.select().from(clients).where(eq(clients.email, clientEmail));
      if (existing) {
        clientId = existing.id;
      } else {
        const [newClient] = await db
          .insert(clients)
          .values({
            name: clientName,
            company: clientCompany || null,
            email: clientEmail,
            phone: clientPhone || null,
          })
          .returning();
        clientId = newClient.id;
      }
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        bookingRef: generateRef(),
        clientId,
        clientName,
        clientCompany: clientCompany || null,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        eventType,
        eventDate,
        endDate: endDate || null,
        venue,
        guestCount: Number(guestCount),
        notes: notes || null,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ ...booking, submittedAt: booking.submittedAt.toISOString() }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: Admin — list bookings
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    let query = db.select().from(bookings).$dynamic();

    if (status && status !== "all") {
      query = query.where(eq(bookings.status, status));
    }
    if (clientId) {
      query = query.where(eq(bookings.clientId, Number(clientId)));
    }

    const rows = await query.orderBy(sql`${bookings.submittedAt} desc`);
    return NextResponse.json(rows.map((b) => ({ ...b, submittedAt: b.submittedAt.toISOString() })));
  } catch (error) {
    console.error("List bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
