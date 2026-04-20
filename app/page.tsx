"use client";

import { useEffect, useState } from "react";
import ReelCard from "@/components/ReelCard";

type Video = {
  _id: string;
  title: string;
  videoUrl: string;
  category: string;
};

export default function HomePage() {
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
    <main
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {videos.map((video) => (
        <ReelCard
          key={video._id}
          title={video.title}
          category={video.category}
          videoUrl={video.videoUrl}
        />
      ))}
    </main>
  );
}