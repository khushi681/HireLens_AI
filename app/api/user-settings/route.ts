/**
 * GET /api/user-settings
 * POST /api/user-settings
 *
 * Manages the authenticated user's preference settings.
 * GET  → Returns the user's settings (creates default if none exist)
 * POST → Updates the user's settings
 *
 * Response: { success: true, data: { ...settings } }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUserSettings, updateUserSettings } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const settings = await getOrCreateUserSettings(userId);

    return NextResponse.json({
      success: true,
      data: {
        id: settings.id,
        userId: settings.user_id,
        defaultResumeName: settings.default_resume_name,
        defaultJobRole: settings.default_job_role,
        theme: settings.theme,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at,
      },
    });
  } catch (error) {
    console.error("User settings fetch error:", error);
    const message = error instanceof Error ? error.message : "Failed to load settings.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const updated = await updateUserSettings(userId, {
      default_resume_name: body.defaultResumeName,
      default_job_role: body.defaultJobRole,
      theme: body.theme,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        userId: updated.user_id,
        defaultResumeName: updated.default_resume_name,
        defaultJobRole: updated.default_job_role,
        theme: updated.theme,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
    });
  } catch (error) {
    console.error("User settings update error:", error);
    const message = error instanceof Error ? error.message : "Failed to save settings.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
