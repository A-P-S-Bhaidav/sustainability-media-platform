import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    // In a real app, verify a Cron Secret to prevent unauthorized refreshes
    const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await prisma.$executeRawUnsafe(`
      REFRESH MATERIALIZED VIEW CONCURRENTLY "ProjectMetrics_MV";
    `);
    
    return NextResponse.json({ success: true, message: "Materialized view refreshed successfully" });
  } catch (error) {
    console.error("[CRON_REFRESH_MV]", error);
    // Fallback to standard refresh if CONCURRENTLY fails (e.g. if index was missing)
    try {
      await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW "ProjectMetrics_MV";`);
      return NextResponse.json({ success: true, message: "Materialized view refreshed (without concurrently)" });
    } catch (fallbackError) {
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }
}
