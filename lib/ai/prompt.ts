/**
 * Engineered prompt for Gemini to act as an experienced ATS recruiter.
 * Compares a resume against a job description and returns structured JSON.
 */

export function buildAnalysisPrompt(resumeText: string, jobDescription: string): string {
  return `You are an experienced ATS (Applicant Tracking System) recruiter with deep expertise in resume screening and talent acquisition.

Your task is to compare the following RESUME against the JOB DESCRIPTION and provide a detailed, unbiased analysis.

## Job Description
${jobDescription}

## Resume
${resumeText}

## Instructions
Analyze the resume as if you were an ATS system combined with a senior recruiter. Evaluate:
1. How well the resume matches the job description's requirements
2. Key strengths that make the candidate stand out
3. Critical weaknesses or gaps in the resume
4. Important keywords or skills from the job description that are missing from the resume
5. Technical skills demonstrated in the resume
6. Soft skills demonstrated in the resume
7. Actionable suggestions to improve the resume for this specific role
8. Overall interview readiness assessment

Return ONLY valid JSON. No markdown, no code fences, no explanations. Only JSON.

Use this exact structure:
{
  "atsScore": number between 0-100,
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "missingKeywords": ["string", ...],
  "technicalSkills": ["string", ...],
  "softSkills": ["string", ...],
  "suggestions": ["string", ...],
  "interviewReadiness": "string describing readiness level"
}

Where atsScore is a holistic match score considering keyword presence, experience level, skill alignment, and overall fit.`;
}
