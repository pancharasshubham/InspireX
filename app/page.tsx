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
  const [showPrompt, setShowPrompt] = useState(true);

  const startY = useRef(0);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.data);
    };

    fetchVideos();

    const timer = setTimeout(() => {
      setShowPrompt(false);
    }, 2800);

    return () => clearTimeout(timer);
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-dvh overflow-hidden bg-black"
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

      {showPrompt && (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/88 px-6">
    <div className="w-full max-w-md text-center text-white animate-fadeIn">
      <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
        InspireX
      </p>

      <h1 className="text-3xl font-semibold leading-tight">
        What are you avoiding?
      </h1>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {[
          "Work",
          "Study",
          "Starting",
          "Discomfort",
          "Reset",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-zinc-200 backdrop-blur"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
)}
    </main>
  );
}