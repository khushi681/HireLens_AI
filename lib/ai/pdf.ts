/**
 * PDF text extraction utility.
 * Extracts text from PDF buffers using unpdf (serverless PDF.js).
 * Only supports text-based PDFs (no OCR for scanned documents).
 */

import { extractText } from "unpdf";

/**
 * Extract text from a PDF file.
 * @param data - The raw PDF file data as a Uint8Array
 * @returns Extracted text content
 * @throws If the PDF cannot be parsed or contains no extractable text
 */
export async function extractTextFromPDF(data: Uint8Array): Promise<string> {
  try {
    const result = await extractText(data, { mergePages: true });

    const text = result.text?.trim();

    if (!text || text.length === 0) {
      throw new Error(
        "No text could be extracted from this PDF. " +
          "The file may be a scanned document (image-based) rather than a text-based PDF.",
      );
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw known error types
      if (
        error.message.includes("file") ||
        error.message.includes("PDF") ||
        error.message.includes("pdf")
      ) {
        throw new Error(`Invalid or corrupted PDF file: ${error.message}`);
      }
      throw error;
    }
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Extract text from a TXT file.
 * @param data - The raw text file data as a Uint8Array
 * @returns The text content as a string
 */
export function extractTextFromTXT(data: Uint8Array): string {
  return new TextDecoder("utf-8").decode(data).trim();
}
