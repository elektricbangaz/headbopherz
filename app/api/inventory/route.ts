import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, inventory } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.select().from(inventory).orderBy(inventory.name);
    return NextResponse.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (error) {
    console.error("List inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, category, description, totalQuantity, dailyRate } = await req.json();
    if (!name || !category || !totalQuantity) {
      return NextResponse.json(
        { error: "Name, category, and quantity required" },
        { status: 400 },
      );
    }

    const qty = Number(totalQuantity);
    const [item] = await db
      .insert(inventory)
      .values({
        name,
        category,
        description: description || null,
        totalQuantity: qty,
        availableQuantity: qty,
        status: "available",
        dailyRate: dailyRate ? Number(dailyRate) : 0,
      })
      .returning();
    return NextResponse.json({ ...item, createdAt: item.createdAt.toISOString() }, { status: 201 });
  } catch (error) {
    console.error("Create inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
