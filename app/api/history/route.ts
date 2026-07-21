/**
 * GET /api/history
 *
 * Returns all saved analyses for the authenticated user, newest first.
 *
 * Query params:
 *   - limit (optional, default: 50)
 *   - offset (optional, default: 0)
 *
 * Response: { success: true, data: SavedAnalysis[], total: number }
 *        or: { success: false, error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserAnalyses } from "@/lib/supabase";

export async function GET(request: NextRequest) {
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

    // ─── Parse query params ──────────────────────────────────────
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 1), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);

    // ─── Fetch from database ─────────────────────────────────────
    const { analyses, total } = await getUserAnalyses(userId, { limit, offset });

    return NextResponse.json({
      success: true,
      data: analyses,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("History fetch error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load history.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
