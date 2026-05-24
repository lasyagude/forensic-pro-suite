import { NextRequest, NextResponse } from "next/server";
import { generateCaseSummary, generateQuickSummary } from "@/lib/aiSummarization";
import { ForensicReportData } from "@/lib/reportGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseData, type }: { caseData: ForensicReportData; type?: "quick" | "detailed" } = body;

    if (!caseData || !caseData.case_id) {
      return NextResponse.json(
        { error: "Missing case data or case_id" },
        { status: 400 }
      );
    }

    if (type === "quick") {
      const summary = await generateQuickSummary(caseData);
      return NextResponse.json({ summary });
    }

    const summary = await generateCaseSummary(caseData);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate case summary" },
      { status: 500 }
    );
  }
}
