import { SocialProfile, SocialPost } from "@/types/social";

const BASE_URL = "https://instagram120.p.rapidapi.com";

async function fetchInstagram<T>(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: any,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY || "",
      "x-rapidapi-host": "instagram120.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("Instagram API Error:", res.status, text);
    throw new Error(`Instagram API request failed: ${res.status} - ${text}`);
  }

  return JSON.parse(text) as T;
}

export async function getInstagramProfile(
  username: string,
): Promise<SocialProfile> {
  const [userInfo, postsData, reelsData] = await Promise.all([
    fetchInstagram<any>("/api/instagram/userInfo", "POST", { username }),

    fetchInstagram<any>("/api/instagram/posts", "POST", {
      username,
      maxId: "",
    }),

    fetchInstagram<any>("/api/instagram/reels", "POST", {
      username,
      maxId: "",
    }),
  ]);

  const user = userInfo?.result?.[0]?.user;

  const feedPosts: SocialPost[] = (postsData?.result?.edges || []).map(
    (item: any) => {
      const node = item?.node;

      const isVideo = node?.media_type === 2 || !!node?.video_versions?.length;

      const videoUrl = node?.video_versions?.[0]?.url || null;
      const thumbnail = node?.image_versions2?.candidates?.[0]?.url || null;

      console.log("View Count:", node?.play_count);

      return {
        id: node?.id || node?.pk || "",
        caption: node?.caption?.text || "",

        createdAt: node?.created_at || null,
        takenAt: node?.taken_at || null,

        mediaType: node?.media_type ?? null,
        isVideo,

        mediaUrl: isVideo ? videoUrl : thumbnail,
        videoUrl,
        thumbnail,

        likeCount: node?.like_count || 0,
        commentCount: node?.comment_count || 0,

        viewCount: isVideo ? (node?.play_count ?? null) : null,
      };
    },
  );

  const reelPosts: SocialPost[] = (reelsData?.result?.edges || []).map(
    (item: any) => {
      const media = item?.node?.media;

      const isVideo =
        media?.media_type === 2 ||
        media?.product_type === "clips" ||
        !!media?.video_versions?.length;

      const videoUrl = media?.video_versions?.[0]?.url || null;
      const thumbnail = media?.image_versions2?.candidates?.[0]?.url || null;

      console.log("View Count:", media?.play_count);
      console.log("FULL MEDIA:", JSON.stringify(media, null, 2));

      return {
        id: media?.id || media?.pk || "",
        caption: media?.caption?.text || "",

        createdAt: media?.created_at || null,
        takenAt: media?.taken_at || null,

        mediaType: media?.media_type ?? null,
        isVideo,

        mediaUrl: isVideo ? videoUrl : thumbnail,
        videoUrl,
        thumbnail,

        likeCount: media?.like_count || 0,
        commentCount: media?.comment_count || 0,

        viewCount: isVideo
          ? (media?.play_count ??
            media?.view_count ??
            media?.video_play_count ??
            null)
          : null,
      };
    },
  );

  console.log("View Counts:", {
    feed: feedPosts.map((p) => p.viewCount),
    reels: reelPosts.map((p) => p.viewCount),
  });

  const reelMap = new Map(
    reelPosts.map((post) => [post.id.split("_")[0], post]),
  );

  const allPosts = [...feedPosts, ...reelPosts]
    .map((post) => {
      const mediaId = post.id.split("_")[0];

      const reelData = reelMap.get(mediaId);

      return {
        ...post,
        viewCount: post.viewCount ?? reelData?.viewCount ?? null,
      };
    })
    .sort((a, b) => {
      const timeA = a.takenAt || a.createdAt || 0;
      const timeB = b.takenAt || b.createdAt || 0;
      return timeB - timeA;
    })
    .slice(0, 5);

  console.log(
    "FINAL POSTS DEBUG:",
    allPosts.map((p) => ({
      id: p.id,
      isVideo: p.isVideo,
      view: p.viewCount,
      takenAt: p.takenAt,
    })),
  );

  const totalViews = reelPosts.reduce(
    (sum, post) => sum + (post.viewCount || 0),
    0,
  );

  const totalLikes = allPosts.reduce(
    (sum, post) => sum + (post.likeCount || 0),
    0,
  );

  return {
    platform: "instagram",
    isPrivate: user?.is_private || false,

    username: user?.username || username,
    fullName: user?.full_name || "",

    avatar:
      user?.hd_profile_pic_versions?.[0]?.url || user?.profile_pic_url || "",

    followerCount: user?.follower_count || 0,
    followingCount: user?.following_count || 0,
    mediaCount: user?.media_count || 0,

    totalViews,
    totalLikes,

    posts: allPosts,
  };
}
