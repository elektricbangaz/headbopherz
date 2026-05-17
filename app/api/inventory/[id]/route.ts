import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, inventory } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const [item] = await db.select().from(inventory).where(eq(inventory.id, Number(id)));
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (error) {
    console.error("Get inventory error:", error);
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
    const { name, category, description, totalQuantity, status, dailyRate } = await req.json();
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (totalQuantity !== undefined) {
      updates.totalQuantity = Number(totalQuantity);
      updates.availableQuantity = Number(totalQuantity);
    }
    if (status !== undefined) updates.status = status;
    if (dailyRate !== undefined) updates.dailyRate = Number(dailyRate);

    const [updated] = await db
      .update(inventory)
      .set(updates)
      .where(eq(inventory.id, Number(id)))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (error) {
    console.error("Update inventory error:", error);
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
    await db.delete(inventory).where(eq(inventory.id, Number(id)));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete inventory error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
