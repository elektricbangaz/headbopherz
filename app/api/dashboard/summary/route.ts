import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, bookings, clients, inventory } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [totalBookings] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(bookings);
    const [pendingBookings] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(bookings)
      .where(eq(bookings.status, "pending"));
    const [approvedBookings] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(bookings)
      .where(eq(bookings.status, "approved"));
    const [rejectedBookings] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(bookings)
      .where(eq(bookings.status, "rejected"));
    const [upcomingThisMonth] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(bookings)
      .where(
        sql`EXTRACT(MONTH FROM ${bookings.eventDate}::date) = ${currentMonth} AND EXTRACT(YEAR FROM ${bookings.eventDate}::date) = ${currentYear} AND ${bookings.status} = 'approved'`,
      );
    const [totalClients] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(clients);
    const [totalInventory] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(inventory);
    const [availableInventory] = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(inventory)
      .where(eq(inventory.status, "available"));

    const recentBookings = await db
      .select()
      .from(bookings)
      .orderBy(sql`${bookings.submittedAt} desc`)
      .limit(5);

    return NextResponse.json({
      totalBookings: totalBookings.count,
      pendingBookings: pendingBookings.count,
      approvedBookings: approvedBookings.count,
      rejectedBookings: rejectedBookings.count,
      upcomingThisMonth: upcomingThisMonth.count,
      totalClients: totalClients.count,
      totalInventoryItems: totalInventory.count,
      availableInventoryItems: availableInventory.count,
      recentBookings: recentBookings.map((b) => ({
        ...b,
        submittedAt: b.submittedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
