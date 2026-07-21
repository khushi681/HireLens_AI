/**
 * GET /api/history/[id]
 *
 * Returns a single saved analysis by ID for the authenticated user.
 *
 * Response: { success: true, data: SavedAnalysis }
 *        or: { success: false, error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserAnalysisById } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // ─── Fetch analysis ──────────────────────────────────────────
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid analysis ID." },
        { status: 400 }
      );
    }

    const analysis = await getUserAnalysisById(id, userId);

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: "Analysis not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis fetch error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load analysis.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
