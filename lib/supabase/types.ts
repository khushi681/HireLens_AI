/**
 * Supabase database type definitions.
 * These mirror the SQL schema for type-safe queries.
 */

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: AnalysisRow;
        Insert: Omit<AnalysisRow, "id" | "created_at">;
        Update: Partial<Omit<AnalysisRow, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface AnalysisRow {
  id: string;
  user_id: string;
  resume_name: string;
  job_title: string;
  ats_score: number;
  strengths: unknown[];
  weaknesses: unknown[];
  missing_keywords: unknown[];
  technical_skills: unknown[];
  soft_skills: unknown[];
  suggestions: unknown[];
  interview_readiness: string;
  created_at: string;
}
