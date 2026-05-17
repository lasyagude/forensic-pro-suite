import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      console.error("Analyze proxy backend error:", response.status, responseBody);
      return NextResponse.json(
        { error: "Forensic backend error during file analysis." },
        { status: response.status }
      );
    }

    return NextResponse.json(responseBody, { status: response.status });
  } catch (error) {
    console.error("Analyze proxy request failed:", error);
    return NextResponse.json(
      { error: "Unable to reach the forensic backend service." },
      { status: 502 }
    );
  }
}
