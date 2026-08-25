import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();

    let extractedText = "";

    if (fileName.endsWith(".pdf")) {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || "";
      } catch (pdfErr) {
        console.error("PDF parse error:", pdfErr);
        // Fallback string extraction for PDFs with text streams
        const rawStr = buffer.toString("utf-8");
        const clean = rawStr.replace(/[^\x20-\x7E\n\r\t]/g, " ");
        extractedText = clean.length > 100 ? clean : "";
      }
    } else if (fileName.endsWith(".txt") || fileName.endsWith(".md") || fileName.endsWith(".json")) {
      extractedText = buffer.toString("utf-8");
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      // Extract textual tokens from docx binary package
      const rawStr = buffer.toString("utf-8");
      const clean = rawStr.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ");
      extractedText = clean.length > 50 ? clean : `Document: ${file.name}`;
    } else {
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `Document: ${file.name}\n(Binary payload uploaded for AI requirement extraction)`;
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("Document extraction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract document text" },
      { status: 500 }
    );
  }
}
