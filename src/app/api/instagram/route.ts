import { NextRequest, NextResponse } from "next/server";
import { getInstagramProfile } from "@/lib/instagram";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username")?.trim();

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: "Instagram username is required",
        },
        { status: 400 }
      );
    }

    const data = await getInstagramProfile(username);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("API /api/instagram error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Instagram data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}