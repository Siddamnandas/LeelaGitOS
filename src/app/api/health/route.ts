import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Perform a simple database query to verify connectivity
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      database: "up",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "down",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}