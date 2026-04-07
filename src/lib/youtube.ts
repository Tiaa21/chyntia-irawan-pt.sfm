import { SocialPost, SocialProfile } from "@/types/social";

const BASE_URL = "https://youtube-data8.p.rapidapi.com";

const headers = {
  "x-rapidapi-key": process.env.RAPID_API_KEY || "",
  "x-rapidapi-host": "youtube-data8.p.rapidapi.com",
};

async function searchChannel(username: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/search/?q=${encodeURIComponent(username)}&type=channel`,
    { headers, cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to search channel");

  const data = await res.json();

  const results = data?.contents || [];

  const channel =
    results.find(
      (item: any) =>
        item?.channel?.title?.toLowerCase() === username.toLowerCase(),
    ) || results[0];

  const channelId = channel?.channel?.channelId;

  if (!channelId) throw new Error("Channel not found");

  return channelId;
}

async function getChannelDetails(channelId: string) {
  const res = await fetch(
    `${BASE_URL}/channel/details/?id=${channelId}`,
    { headers, cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to fetch channel details");

  return res.json();
}

async function getChannelVideos(channelId: string) {
  const res = await fetch(
    `${BASE_URL}/channel/videos/?id=${channelId}&filter=videos_latest`,
    { headers, cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to fetch videos");

  return res.json();
}

async function getVideoDetails(videoId: string) {
  const res = await fetch(
    `${BASE_URL}/video/details/?id=${videoId}`,
    { headers, cache: "no-store" },
  );

  if (!res.ok) return null;

  return res.json();
}

export async function fetchYouTubeProfile(
  username: string,
): Promise<SocialProfile> {
  const channelId = await searchChannel(username);

  const [channel, videosData] = await Promise.all([
    getChannelDetails(channelId),
    getChannelVideos(channelId),
  ]);

  const videos = (videosData?.contents || [])
    .filter((v: any) => v.type === "video" || v.type === "music")
    .slice(0, 5);

  const posts: SocialPost[] = await Promise.all(
    videos.map(async (item: any) => {
      const v = item.video;

      const details = await getVideoDetails(v.videoId);

      return {
        id: v.videoId,

        caption: v.title || "",

        createdAt: null,
        takenAt: null,

        mediaType: 1,
        isVideo: false,

        mediaUrl: v.thumbnails?.[0]?.url || null,
        thumbnail: v.thumbnails?.[0]?.url || null,

        likeCount: details?.stats?.likes || 0,
        commentCount: details?.stats?.comments || 0,
        viewCount: v?.stats?.views || 0,
      };
    }),
  );

  return {
    platform: "youtube",
    isPrivate: false,

    username: channel?.canonicalBaseUrl?.replace("/@", "") || username,
    fullName: channel?.title || "",

    avatar: channel?.avatar?.[0]?.url || "",

    mediaCount: channel?.stats?.videos || 0,
    followerCount: channel?.stats?.subscribers || 0,

    totalViews: channel?.stats?.views || 0,
    totalLikes: posts.reduce((acc, p) => acc + (p.likeCount || 0), 0),

    posts,
  };
}