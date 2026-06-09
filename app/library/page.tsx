"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import { track } from "@/lib/track";

type Video = {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
};

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        setVideos(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    track("library_opened");
  }, []);

  return (
    <main className="min-h-dvh bg-black pb-24">
      <div className="grid max-w-5xl mx-auto grid-cols-3 gap-1 lg:grid-cols-3">
        {videos.map((video, index) => (
          <button
            key={video._id}
            onClick={() => router.push(`/feed?index=${index}`)}
            className="relative aspect-9/16 overflow-hidden bg-zinc-900"
          >
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                sizes="33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500 px-2 text-center">
                No Thumbnail
              </div>
            )}

            <div className="absolute inset-0 bg-black/10" />
          </button>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}