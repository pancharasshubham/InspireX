"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

type Video = {
  _id: string;
  title: string;
  videoUrl: string;
};

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.data);
    };

    fetchVideos();
  }, []);

  return (
    <main className="min-h-dvh bg-black pb-20">
      <div className="grid grid-cols-3 gap-1">
        {videos.map((video) => (
          <div key={video._id} className="aspect-9/16 bg-zinc-900">
            <video
              src={video.videoUrl}
              muted
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}