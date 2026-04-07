import { SocialPost, SocialProfile } from "@/types/social";

const BASE_URL = "https://tiktok-api6.p.rapidapi.com";

async function fetchTikTok<T>(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: any,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY || "",
      "x-rapidapi-host": "tiktok-api6.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("TikTok API Error:", res.status, text);
    throw new Error(`TikTok API request failed: ${res.status} - ${text}`);
  }

  return JSON.parse(text) as T;
}

export async function fetchTikTokProfile(
  username: string,
): Promise<SocialProfile> {
  const user = await fetchTikTok<any>(`/user/details?username=${username}`);

  const videosData = await fetchTikTok<any>(
    `/user/videos?username=${username}`,
  );

  const videos = videosData?.videos || [];

  const posts: SocialPost[] = videos.slice(0, 5).map((v: any) => ({
    id: v.video_id,
    caption: v.description || "",

    createdAt: v.create_time || null,
    takenAt: v.create_time || null,

    mediaType: 2,
    isVideo: true,
    productType: "tiktok",

    mediaUrl: v.cover || null,
    videoUrl: v.download_url || null,
    thumbnail: v.cover || null,

    likeCount: v.statistics?.number_of_hearts || 0,
    commentCount: v.statistics?.number_of_comments || 0,
    viewCount: v.statistics?.number_of_plays || 0,
  }));

  const totalViews = videos.reduce(
    (sum: number, v: any) => sum + (v.statistics?.number_of_plays || 0),
    0,
  );

  const totalLikes = videos.reduce(
    (sum: number, v: any) => sum + (v.statistics?.number_of_hearts || 0),
    0,
  );

  return {
    platform: "tiktok",
    isPrivate: false,

    username: user.username,
    fullName: user.username,
    avatar: user.profile_image,

    mediaCount: user.total_videos || 0,
    followingCount: user.following || 0,
    followerCount: user.followers || 0,

    totalViews,
    totalLikes,

    posts,
  };
}
