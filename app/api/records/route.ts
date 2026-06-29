import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.record.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json(
    records.map((record) => ({
      ...record,
      amount: Number(record.amount)
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const amount = Number(body.amount);
  const category = String(body.category ?? "").trim();
  const note = String(body.note ?? "").trim();
  const date = body.date ? new Date(body.date) : new Date();
  const type = body.type === "income" ? "income" : "expense";

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "请输入大于 0 的金额。" }, { status: 400 });
  }

  if (!category) {
    return NextResponse.json({ message: "请输入类别。" }, { status: 400 });
  }

  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ message: "日期格式无效。" }, { status: 400 });
  }

  const record = await prisma.record.create({
    data: {
      amount,
      type,
      category,
      note,
      date
    }
  });

  return NextResponse.json({ ...record, amount: Number(record.amount) }, { status: 201 });
}
