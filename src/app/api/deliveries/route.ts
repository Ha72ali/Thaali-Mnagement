import { DeliveryStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    if (!date || !dateRe.test(date)) {
      return NextResponse.json({ error: "Query date (YYYY-MM-DD) required" }, { status: 400 });
    }
    const families = await prisma.family.findMany({ orderBy: { name: "asc" } });
    const rows = await prisma.dailyDelivery.findMany({ where: { date } });
    const byFamily = new Map(rows.map((r) => [r.familyId, r.status]));
    const list = families.map((f) => ({
      family: f,
      status: byFamily.get(f.id) ?? DeliveryStatus.PENDING,
      deliveryId: rows.find((r) => r.familyId === f.id)?.id ?? null,
    }));
    return NextResponse.json({ date, list });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch deliveries. Please check database connection." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { familyId, date, status } = body as Record<string, unknown>;
    if (typeof familyId !== "string" || typeof date !== "string" || !dateRe.test(date)) {
      return NextResponse.json({ error: "familyId and date (YYYY-MM-DD) required" }, { status: 400 });
    }
    if (status !== "DELIVERED" && status !== "NOT_DELIVERED" && status !== "PENDING") {
      return NextResponse.json({ error: "status must be DELIVERED, NOT_DELIVERED, or PENDING" }, { status: 400 });
    }
    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }
    const row = await prisma.dailyDelivery.upsert({
      where: { familyId_date: { familyId, date } },
      create: { familyId, date, status: status as DeliveryStatus },
      update: { status: status as DeliveryStatus },
    });
    return NextResponse.json(row);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update delivery status. Please try again." },
      { status: 500 }
    );
  }
