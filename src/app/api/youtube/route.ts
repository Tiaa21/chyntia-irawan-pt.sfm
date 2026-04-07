import { NextResponse } from "next/server";
import { fetchYouTubeProfile } from "@/lib/youtube";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 },
      );
    }

    const data = await fetchYouTubeProfile(username);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("YouTube API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch YouTube data",
      },
      { status: 500 },
    );
  }
}