import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * DELETE /api/favorites/:id — remove a saved location
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    await prisma.favorite.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/favorites/:id]", err);
    return NextResponse.json(
      { error: "Unable to remove favorite." },
      { status: 404 }
    );
  }
}
