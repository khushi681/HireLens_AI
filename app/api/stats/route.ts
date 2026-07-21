/**
 * GET /api/stats
 *
 * Returns computed dashboard statistics for the authenticated user.
 *
 * Response: { success: true, data: DashboardStats }
 *        or: { success: false, error: string }
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserStats } from "@/lib/supabase";

export async function GET() {
  try {
    // ─── Authenticate ────────────────────────────────────────────
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    // ─── Fetch stats from database ───────────────────────────────
    const stats = await getUserStats(userId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load statistics.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
