/**
 * POST /api/analyze
 *
 * Accepts a resume file (PDF/TXT) and job description text.
 * Extracts text from the resume, sends to Gemini for analysis,
 * saves the result to the database, and returns structured JSON.
 *
 * Request: FormData with fields:
 *   - resume: File (PDF or TXT)
 *   - jobDescription: string
 *
 * Response: { success: true, data: AnalysisResult, analysisId: string }
 *        or: { success: false, error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyzeResume } from "@/lib/ai/gemini";
import { extractTextFromPDF, extractTextFromTXT } from "@/lib/ai/pdf";
import { saveAnalysis, checkAnalysisLimit } from "@/lib/supabase";

export async function POST(request: NextRequest) {
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

    // ─── Parse FormData ──────────────────────────────────────────
    const formData = await request.formData();

    const resumeFile = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    // ─── Validation ───────────────────────────────────────────────
    if (!resumeFile) {
      return NextResponse.json(
        { success: false, error: "No resume file uploaded." },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Job description is empty." },
        { status: 400 }
      );
    }

    // ─── Check usage limit (free users) ───────────────────────────
    const usageCheck = await checkAnalysisLimit(userId);

    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Daily analysis limit reached. You've used ${usageCheck.usedToday} of ${usageCheck.limit} analyses today. Upgrade to Pro for unlimited access.`,
          limitReached: true,
          usage: {
            usedToday: usageCheck.usedToday,
            limit: usageCheck.limit,
            plan: usageCheck.plan,
          },
        },
        { status: 429 }
      );
    }

    // ─── Validate file type ───────────────────────────────────────
    const fileType = resumeFile.type;
    const fileName = resumeFile.name.toLowerCase();

    const isPDF = fileType === "application/pdf" || fileName.endsWith(".pdf");
    const isTXT = fileType === "text/plain" || fileName.endsWith(".txt");

    if (!isPDF && !isTXT) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file format. Only PDF and TXT files are supported for text extraction.",
        },
        { status: 400 }
      );
    }

    // ─── Extract resume text ──────────────────────────────────────
    const arrayBuffer = await resumeFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let resumeText: string;

    try {
      if (isPDF) {
        resumeText = await extractTextFromPDF(uint8Array);
      } else {
        resumeText = extractTextFromTXT(uint8Array);
      }
    } catch (extractError) {
      return NextResponse.json(
        {
          success: false,
          error:
            extractError instanceof Error
              ? extractError.message
              : "Failed to extract text from the uploaded file.",
        },
        { status: 422 }
      );
    }

    // ─── Validate extracted text ──────────────────────────────────
    if (resumeText.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The uploaded file contains too little text to analyze. " +
            "Please upload a resume with more content or try a different format.",
        },
        { status: 422 }
      );
    }

    // ─── Call Gemini ──────────────────────────────────────────────
    let result;
    try {
      result = await analyzeResume(resumeText, jobDescription.trim());
    } catch (aiError) {
      const message =
        aiError instanceof Error
          ? aiError.message
          : "AI analysis failed. Please try again.";

      return NextResponse.json(
        { success: false, error: message },
        { status: 502 }
      );
    }

    // ─── Save to database ─────────────────────────────────────────
    try {
      const saved = await saveAnalysis({
        userId,
        resumeName: resumeFile.name,
        jobDescription: jobDescription.trim(),
        result,
      });

      return NextResponse.json({
        success: true,
        data: result,
        analysisId: saved.id,
        createdAt: saved.createdAt,
      });
    } catch (dbError) {
      // Analysis succeeded but save failed — return results anyway
      // so the user doesn't lose their work, but log the error
      console.error("Failed to save analysis to database:", dbError);

      return NextResponse.json({
        success: true,
        data: result,
        analysisId: null,
        createdAt: null,
        saveWarning:
          "Your analysis was generated but could not be saved to your history. " +
          "You can still view the results below.",
      });
    }
  } catch (error) {
    // ─── Handle unexpected errors ─────────────────────────────────
    console.error("Resume analysis error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during analysis.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
