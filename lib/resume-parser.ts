//@ts-ignore
import pdfParse from "pdf-parse";

// Accepts a Buffer (from uploaded file) and returns plain text
export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  const data = await pdfParse(buffer);
  const text = data.text
    .replace(/\s+/g, " ")  // collapse multiple spaces/newlines
    .trim();

  if (!text || text.length < 50) {
    throw new Error("Could not extract text from PDF. Make sure it's not a scanned image.");
  }

  return text;
};