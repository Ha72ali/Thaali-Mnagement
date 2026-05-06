import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const families = await prisma.family.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(families);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database connection failed. Please check DATABASE_URL configuration." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { name, address, phone, memberCount } = body as Record<string, unknown>;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof address !== "string" ||
      !address.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof memberCount !== "number" ||
      !Number.isInteger(memberCount) ||
      memberCount < 1
    ) {
      return NextResponse.json(
        { error: "name, address, phone (non-empty strings) and memberCount (integer ≥ 1) required" },
        { status: 400 },
      );
    }
    const family = await prisma.family.create({
      data: {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        memberCount,
      },
    });
    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create family. Please try again." },
      { status: 500 }
    );
  }
}
