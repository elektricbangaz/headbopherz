import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, bookings } from "@/lib/db";
import { and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const now = new Date();
    const targetMonth = searchParams.get("month") ? Number(searchParams.get("month")) : now.getMonth() + 1;
    const targetYear = searchParams.get("year") ? Number(searchParams.get("year")) : now.getFullYear();

    const rows = await db
      .select({
        id: bookings.id,
        bookingRef: bookings.bookingRef,
        clientName: bookings.clientName,
        eventType: bookings.eventType,
        eventDate: bookings.eventDate,
        endDate: bookings.endDate,
        status: bookings.status,
      })
      .from(bookings)
      .where(
        and(
          sql`EXTRACT(MONTH FROM ${bookings.eventDate}::date) = ${targetMonth}`,
          sql`EXTRACT(YEAR FROM ${bookings.eventDate}::date) = ${targetYear}`,
        ),
      );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Calendar error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
