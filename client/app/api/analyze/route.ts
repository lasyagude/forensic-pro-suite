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
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ANALYZE_PROXY_KEY = process.env.ANALYZE_API_KEY ?? "forensic-pro-suite-demo-analyze-key";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file upload" }, { status: 400 });
  }

  const forwardForm = new FormData();
  forwardForm.append("file", file, file.name);

  const backendResponse = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "X-Analyze-Key": ANALYZE_PROXY_KEY,
    },
    body: forwardForm,
  });

  const contentType = backendResponse.headers.get("content-type") || "application/json";
  const payload = await backendResponse.text();

  return new NextResponse(payload, {
    status: backendResponse.status,
    headers: {
      "content-type": contentType,
    },
  });
}
