"use client";

import { useEffect, useRef, useState } from "react";
import ReelCard from "@/components/ReelCard";

type Video = {
  _id: string;
  title: string;
  videoUrl: string;
};

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.data);
    };

    fetchVideos();
  }, []);

  const goToIndex = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, videos.length - 1));
    setCurrentIndex(safeIndex);

    const target = document.getElementById(`reel-${safeIndex}`);
    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;

    if (Math.abs(diff) < 60) return;

    if (diff > 0) {
      goToIndex(currentIndex + 1);
    } else {
      goToIndex(currentIndex - 1);
    }
  };

  return (
    <main
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-dvh overflow-hidden touch-pan-y"
      style={{ touchAction: "pan-y" }}
    >
      {videos.map((video, index) => (
        <div id={`reel-${index}`} key={video._id}>
          <ReelCard
            title={video.title}
            videoUrl={video.videoUrl}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
          />
        </div>
      ))}
    </main>
  );
}