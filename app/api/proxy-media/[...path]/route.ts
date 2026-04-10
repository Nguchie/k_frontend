import { NextRequest, NextResponse } from "next/server";
import { getBackendInternalUrl } from "@/lib/backend";

const BACKEND_INTERNAL_URL = getBackendInternalUrl();

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    if (!BACKEND_INTERNAL_URL) {
      throw new Error("Backend URL missing");
    }

    const { path } = await context.params;
    const targetUrl = `${BACKEND_INTERNAL_URL}/${path.join("/")}${request.nextUrl.search || ""}`;
    const response = await fetch(targetUrl, {
      headers: request.headers,
      cache: "force-cache",
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Media proxy request failed" },
      { status: 502 },
    );
  }
}
