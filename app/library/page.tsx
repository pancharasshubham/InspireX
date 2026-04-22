"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Video = {
  _id: string;
  title: string;
  videoUrl: string;
};

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.data);
    };

    fetchVideos();
  }, []);

    const getThumbnail = (url: string) => {
      return `${url}?tr=so-1,w-400,h-700`;
    };

  return (
    <main className="min-h-dvh bg-black pb-24">
      <div className="grid grid-cols-3 gap-0.5">
        {videos.map((video, index) => (
          <button
            key={video._id}
            onClick={() => router.push(`/feed?index=${index}`)}
            className="relative aspect-9/16 overflow-hidden bg-zinc-900"
          >
            <img
               src={getThumbnail(video.videoUrl)}
               alt={video.title}
               className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />
          </button>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}