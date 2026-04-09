import { NextRequest, NextResponse } from "next/server";

import { searchContent } from "@/lib/api";

export async function GET(request: NextRequest) {
  const data = await searchContent(request.nextUrl.searchParams);
  return NextResponse.json(data);
}
