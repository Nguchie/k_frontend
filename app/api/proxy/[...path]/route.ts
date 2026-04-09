import { NextRequest, NextResponse } from "next/server";

const BACKEND_INTERNAL_URL = (process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/api\/?$/, "");

function getTargetUrl(request: NextRequest, path: string[]) {
  if (!BACKEND_INTERNAL_URL) {
    throw new Error("Backend URL missing");
  }

  const pathname = path.join("/");
  const search = request.nextUrl.search || "";
  return `${BACKEND_INTERNAL_URL}/api/${pathname}/${search}`;
}

async function forwardRequest(request: NextRequest, path: string[]) {
  try {
    const targetUrl = getTargetUrl(request, path);
    const headers = new Headers(request.headers);
    headers.delete("host");

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
      redirect: "follow",
      cache: "no-store",
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Proxy request failed" },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}
