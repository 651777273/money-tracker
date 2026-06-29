import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recordId = Number(id);

  if (!Number.isInteger(recordId)) {
    return NextResponse.json({ message: "记录 ID 无效。" }, { status: 400 });
  }

  await prisma.record.delete({
    where: { id: recordId }
  });

  return NextResponse.json({ ok: true });
}
