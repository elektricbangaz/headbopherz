import { NextResponse } from "next/server";
import { db, inventory } from "@/lib/db";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: inventory.id,
        name: inventory.name,
        category: inventory.category,
        description: inventory.description,
        dailyRate: inventory.dailyRate,
        availableQuantity: inventory.availableQuantity,
        status: inventory.status,
      })
      .from(inventory)
      .orderBy(inventory.category, inventory.name);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Public equipment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
