"use client";

import { useEffect, useState } from "react";
import { SocialProfile } from "@/types/social";
import {
  FaHeart,
  FaInstagram,
  FaRegComment,
  FaRegEye,
  FaSearch,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<SocialProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState<
    "instagram" | "tiktok" | "youtube" | null
  >(null);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [loading]);

  const fetchData = async (
    selectedPlatform: "instagram" | "tiktok" | "youtube",
  ) => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/${selectedPlatform}?username=${encodeURIComponent(username)}`,
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch data");
      }

      setData(result.data);
      setPlatform(selectedPlatform);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // console.log("Instagram Profile Data:", data);

  return (
    <main className="bg-white text-zinc-900 p-4">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-4 border-zinc-700"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>

            <p className="text-sm text-zinc-300 animate-pulse">
              Fetching data...
            </p>
          </div>
        </div>
      )}

      <div className="flex w-full">
        <div className="flex w-full gap-10">
          <div className="flex w-1/3 place-content-center">
            <div className="bg-white p-6">
              <div className="flex flex-col items-center text-center gap-4 mb-6">
                <div className="flex flex-col items-center gap-8">
                  <h1 className="text-2xl font-bold">Dashboard Social Media</h1>

                  <img
                    src={
                      data?.avatar
                        ? `/api/media?url=${encodeURIComponent(data.avatar)}`
                        : "https://cdn.vectorstock.com/i/500p/44/01/default-avatar-photo-placeholder-icon-grey-vector-38594401.jpg"
                    }
                    alt={data?.fullName || data?.username}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-xl font-bold">
                    {data?.fullName || (
                      <span className="inline-block h-6 w-32 bg-zinc-300 animate-pulse rounded"></span>
                    )}
                  </p>
                  <p className="text-zinc-900">@{data?.username}</p>
                </div>
              </div>

              <div className="flex gap-4 text-center place-content-center items-center mb-8">
                <div className="p-4">
                  <p className="text-2xl font-bold">
                    {data?.followerCount?.toLocaleString() ?? "-"}
                  </p>
                  <p className="text-sm text-zinc-900 mt-2">Followers</p>
                </div>

                <div className="border-l-2 h-8 align-top"></div>

                <div className="p-4">
                  <p className="text-2xl font-bold">
                    {data?.followingCount?.toLocaleString() ?? "-"}
                  </p>
                  <p className="text-sm text-zinc-900 mt-2">Following</p>
                </div>

                <div className="border-l-2 h-8"></div>

                <div className="p-4">
                  <p className="text-2xl font-bold">
                    {data?.mediaCount?.toLocaleString() ?? "-"}
                  </p>
                  <p className="text-sm text-zinc-900 mt-2">Media Count</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-blue-200 shadow-lg bg-blue-100 p-4">
                  <p className="text-sm  text-zinc-900">Total Views</p>
                  <p className="text-2xl font-bold">
                    {data?.totalViews?.toLocaleString() ?? "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-pink-200 shadow-lg bg-pink-100 p-4">
                  <p className="text-sm  text-zinc-900">Total Likes</p>
                  <p className="text-2xl font-bold">
                    {data?.totalLikes?.toLocaleString() ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-2/3 min-h-screen bg-zinc-100 p-10 rounded-[3.5rem] border border-zinc-200 shadow-2xl">
            <div className="flex flex-row justify-between mb-8">
              <div className="relative w-2/5">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />

                <input
                  type="text"
                  placeholder="Enter username/channel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-full border border-zinc-100 bg-white pl-12 pr-4 py-3 text-sm font-medium outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex gap-4 text-xs">
                <button
                  onClick={() => fetchData("instagram")}
                  disabled={loading}
                  className={`rounded-full px-5 font-bold shadow-lg flex align-middle place-items-center disabled:opacity-50 ${
                    platform === "instagram"
                      ? "bg-linear-to-bl from-orange-500 to-pink-600 bg-clip-text text-transparent border-2 border-pink-500 hover:scale-105 hover:cursor-pointer transition duration-300"
                      : "text-white bg-linear-to-bl from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 hover:scale-105 hover:cursor-pointer transition duration-300"
                  }`}
                >
                  <FaInstagram
                    className={
                      "w-5 h-5 mr-2 " +
                      (platform === "instagram"
                        ? "text-pink-500"
                        : "text-white")
                    }
                  />

                  {platform === "instagram"
                    ? "Re-fetch Instagram"
                    : "Fetch Instagram"}
                </button>

                <button
                  onClick={() => fetchData("tiktok")}
                  disabled={loading}
                  className={`rounded-full px-5 font-bold shadow-lg flex align-middle place-items-center disabled:opacity-50 ${
                    platform === "tiktok"
                      ? "bg-linear-to-bl from-cyan-900 via-slate-900 to-pink-900 bg-clip-text text-transparent border-2 border-cyan-800 hover:scale-105 hover:cursor-pointer transition duration-300"
                      : "text-white bg-linear-to-tr from-cyan-900 via-slate-900 to-pink-900 hover:from-cyan-900 hover:via-slate-900 hover:to-pink-900 hover:scale-105 hover:cursor-pointer transition duration-300"
                  }`}
                >
                  <FaTiktok
                    className={
                      "w-5 h-5 mr-2 " +
                      (platform === "tiktok" ? "text-cyan-900" : "text-white")
                    }
                  />

                  {platform === "tiktok" ? "Re-fetch TikTok" : "Fetch TikTok"}
                </button>

                <button
                  onClick={() => fetchData("youtube")}
                  disabled={loading}
                  className={`rounded-full px-5 font-bold shadow-lg flex align-middle place-items-center disabled:opacity-50 ${
                    platform === "youtube"
                      ? "bg-linear-to-bl from-red-600 to-red-800 bg-clip-text text-transparent border-2 border-pink-900 hover:scale-105 hover:cursor-pointer transition duration-300"
                      : "text-white bg-linear-to-br from-red-600 to-red-800 hover:from-red-800 hover:to-red-800 hover:scale-105 hover:cursor-pointer transition duration-300"
                  }`}
                >
                  <FaYoutube
                    className={
                      "w-5 h-5 mr-2 " +
                      (platform === "youtube" ? "text-red-600" : "text-white")
                    }
                  />

                  {platform === "youtube"
                    ? "Re-fetch YouTube"
                    : "Fetch YouTube"}
                </button>
              </div>
            </div>

            {/* POSTS / REELS */}
            <div>
              <h2 className="text-4xl font-bold mb-4">Latest Posts / Reels</h2>

              {error && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                  {error}
                </div>
              )}

              {data?.posts?.length ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {data.posts.map((post) => (
                    <div key={post.id} className="rounded-2xl p-4 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex max-h-2/3 text-xs place-content-center items-center">
                          {post.isVideo ? (
                            <video
                              controls
                              className="w-full h-full rounded-xl object-cover"
                              src={post.videoUrl || ""}
                            />
                          ) : (
                            <img
                              className="w-full rounded-xl object-cover"
                              src={post.thumbnail || ""}
                              alt={post.caption}
                            />
                          )}
                        </div>

                        <div className="flex gap-4 font-semibold text-[16px] text-shadow-sm place-items-center text-center">
                          <div className="flex place-items-center gap-2">
                            <p className="text-red-500">
                              <FaHeart />
                            </p>
                            <p className="font-semibold">
                              {post.likeCount?.toLocaleString() ?? "0"}
                            </p>
                          </div>

                          <div className="flex place-items-center gap-2">
                            <p className="text-green-500">
                              <FaRegComment />
                            </p>
                            <p className="font-semibold">
                              {post.commentCount?.toLocaleString() ?? "0"}
                            </p>
                          </div>

                          <div className="flex place-items-center gap-2">
                            <p className="text-blue-800">
                              <FaRegEye />
                            </p>
                            <p className="font-semibold">
                              {post.viewCount !== null &&
                              post.viewCount !== undefined
                                ? post.viewCount.toLocaleString()
                                : "-"}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-zinc-900 line-clamp-4">
                          {post.caption || "No caption"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.isPrivate ? (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-800 text-sm">
                  This profile is private. Posts cannot be displayed.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div className="flex flex-col gap-4">
                      <div
                        key={i}
                        className="h-40 bg-zinc-200 animate-pulse rounded-xl"
                      />
                      <div
                        key={i}
                        className="h-6 bg-zinc-200 animate-pulse rounded-xl"
                      />
                      <div className="flex justify-between gap-3">
                        <div
                          key={i}
                          className="h-6 bg-zinc-200 animate-pulse rounded-xl w-1/3"
                        />
                        <div
                          key={i}
                          className="h-6 bg-zinc-200 animate-pulse rounded-xl w-1/3"
                        />
                        <div
                          key={i}
                          className="h-6 bg-zinc-200 animate-pulse rounded-xl w-1/3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
