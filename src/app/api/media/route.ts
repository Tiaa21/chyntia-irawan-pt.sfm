import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
      return new NextResponse("Missing URL", { status: 400 });
    }

    const res = await fetch(url);

    if (!res.ok) {
      return new NextResponse("Failed to fetch media", { status: 500 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err) {
    return new NextResponse("Proxy error", { status: 500 });
  }
}   