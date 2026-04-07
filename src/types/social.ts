export type SocialPost = {
  id: string;
  caption: string;
  createdAt: number | null;
  takenAt: number | null;

  mediaType: number | null;
  isVideo: boolean;
  productType?: string | null;

  mediaUrl: string | null;
  videoUrl: string | null;
  thumbnail: string | null;

  likeCount: number;
  commentCount: number;
  viewCount: number;
};

export type SocialProfile = {
  platform: "instagram" | "tiktok" | "youtube";
  isPrivate: boolean;
  username: string;
  fullName: string;
  avatar: string;
  mediaCount: number;
  followingCount?: number;
  followerCount?: number;
  totalViews?: number;
  totalLikes?: number;
  posts: SocialPost[];
};
