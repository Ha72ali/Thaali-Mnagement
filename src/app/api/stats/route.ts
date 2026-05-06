import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/dates";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const date = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : todayKey();

    const [totalFamilies, deliveredToday] = await Promise.all([
      prisma.family.count(),
      prisma.dailyDelivery.count({
        where: { date, status: "DELIVERED" },
      }),
    ]);

    const pendingDeliveries = Math.max(0, totalFamilies - deliveredToday);

    return NextResponse.json({
      date,
      totalFamilies,
      deliveriesCompletedToday: deliveredToday,
      pendingDeliveries,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics. Please check database connection." },
      { status: 500 }
    );
  }
}
