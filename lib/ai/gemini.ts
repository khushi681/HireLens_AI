/**
 * Gemini AI service for resume analysis.
 * Handles initialization and content generation with structured JSON output.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "@/types";
import { buildAnalysisPrompt } from "./prompt";

// Initialize the Gemini client
function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. " +
      "Please add it to your .env.local file."
    );
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Get the generative model configured for JSON output.
 */
function getModel() {
  const genAI = getClient();

  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
    },
  });
}

/**
 * Parse the Gemini response into a structured AnalysisResult.
 * Handles edge cases like malformed JSON or missing fields.
 */
function parseAnalysisResponse(text: string): AnalysisResult {
  // Try direct parse first
  try {
    const parsed = JSON.parse(text);
    return validateAndFillResult(parsed);
  } catch {
    // If direct parse fails, try to extract JSON from the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return validateAndFillResult(parsed);
      } catch {
        throw new Error("Failed to parse AI response: invalid JSON structure");
      }
    }
    throw new Error("Failed to parse AI response: no JSON found");
  }
}

/**
 * Validate and fill missing fields with defaults.
 */
function validateAndFillResult(data: Record<string, unknown>): AnalysisResult {
  return {
    atsScore: typeof data.atsScore === "number" ? Math.max(0, Math.min(100, data.atsScore)) : 0,
    strengths: Array.isArray(data.strengths) ? data.strengths.map(String) : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses.map(String) : [],
    missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords.map(String) : [],
    technicalSkills: Array.isArray(data.technicalSkills) ? data.technicalSkills.map(String) : [],
    softSkills: Array.isArray(data.softSkills) ? data.softSkills.map(String) : [],
    suggestions: Array.isArray(data.suggestions) ? data.suggestions.map(String) : [],
    interviewReadiness: typeof data.interviewReadiness === "string" ? data.interviewReadiness : "Unable to assess",
  };
}

/**
 * Analyze a resume against a job description using Gemini.
 * Returns a structured AnalysisResult.
 */
export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const prompt = buildAnalysisPrompt(resumeText, jobDescription);
  const model = getModel();

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Gemini returned an empty response");
    }

    return parseAnalysisResponse(text);
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw known errors with context
      if (
        error.message.includes("API_KEY") ||
        error.message.includes("API key")
      ) {
        throw new Error("Invalid or missing Gemini API key");
      }
      if (error.message.includes("SAFETY")) {
        throw new Error("Content was blocked by Gemini safety filters");
      }
      if (error.message.includes("429") || error.message.includes("quota")) {
        throw new Error("Gemini API rate limit exceeded. Please try again later.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred during AI analysis");
  }
}
