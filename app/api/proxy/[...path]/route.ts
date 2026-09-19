import { NextRequest, NextResponse } from "next/server";
import { getBackendInternalUrl } from "@/lib/backend";

export const maxDuration = 30;

const HOP_BY_HOP_HEADERS = new Set([
  "accept-encoding",
  "connection",
  "content-length",
  "cookie",
  "forwarded",
  "host",
  "keep-alive",
  "location",
  "origin",
  "referer",
  "set-cookie",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
  "x-real-ip",
]);

function getTargetUrl(request: NextRequest, path: string[]) {
  const backendUrl = getBackendInternalUrl();
  if (!backendUrl) {
    throw new Error("Backend URL missing");
  }

  const pathname = path.filter(Boolean).join("/");
  const search = request.nextUrl.search || "";
  return `${backendUrl}/api/${pathname}/${search}`;
}

function buildRequestHeaders(request: NextRequest) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  headers.set("accept", request.headers.get("accept") || "application/json");
  return headers;
}

function buildResponseHeaders(response: Response) {
  const headers = new Headers();
  response.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase()) && key.toLowerCase() !== "content-encoding") {
      headers.set(key, value);
    }
  });
  return headers;
}

async function forwardRequest(request: NextRequest, path: string[]) {
  try {
    const targetUrl = getTargetUrl(request, path);
    const method = request.method.toUpperCase();
    const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

    const response = await fetch(targetUrl, {
      method,
      headers: buildRequestHeaders(request),
      body,
      redirect: "manual",
      cache: "no-store",
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: buildResponseHeaders(response),
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
