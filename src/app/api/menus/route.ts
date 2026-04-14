import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (date) {
    if (!dateRe.test(date)) {
      return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
    }
    const menu = await prisma.menu.findUnique({ where: { date } });
    return NextResponse.json(menu);
  }
  const menus = await prisma.menu.findMany({ orderBy: { date: "desc" }, take: 60 });
  return NextResponse.json(menus);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { date, items } = body as { date?: unknown; items?: unknown };
  if (typeof date !== "string" || !dateRe.test(date)) {
    return NextResponse.json({ error: "date (YYYY-MM-DD) required" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items must be a non-empty array of strings" }, { status: 400 });
  }
  const cleaned = items.map((i) => String(i).trim()).filter(Boolean);
  if (cleaned.length === 0) {
    return NextResponse.json({ error: "At least one menu item name required" }, { status: 400 });
  }
  const menu = await prisma.menu.upsert({
    where: { date },
    create: { date, items: JSON.stringify(cleaned) },
    update: { items: JSON.stringify(cleaned) },
  });
  return NextResponse.json(menu, { status: 201 });
}
