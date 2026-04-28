"use client";

export const dynamic = "force-dynamic";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import ReelCard from "@/components/ReelCard";
import BottomNav from "@/components/BottomNav";
import { useSearchParams } from "next/navigation";

type Video = {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
};

function FeedContent() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(true);

  const promptPool = [
  "Starting the hard task",
  "Failure",
  "Being judged",
  "Your unfinished work",
  "Wasted time",
  "Phone addiction",
  "Discomfort",
  "Your future self",
  "Responsibility",
  "Hard work",
  "Consistency",
  "The truth about your habits",
  "Trying again",
  "Silence",
  "Reality",
];

  const [promptOptions, setPromptOptions] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const startIndex = Number(searchParams.get("index") || 0);

  const startY = useRef(0);

  const goToIndex = useCallback(
     (index: number, smooth: boolean = true) => {
        const safeIndex = Math.max(0, Math.min(index, videos.length - 1));

        setCurrentIndex(safeIndex);

        const target = document.getElementById(`reel-${safeIndex}`);

        target?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
        });
     },
     [videos.length] 
 );

  const getRandomPrompts = () => {
  return [...promptPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
};

  useEffect(() => {
    const init = async () => {
      const res = await fetch("/api/videos");
      const data = await res.json();

      setVideos(data.data);

      const introSeen = sessionStorage.getItem("introSeen");

      if (introSeen) {
        setIsLoading(false);
        setShowPrompt(false);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        setPromptOptions(getRandomPrompts());
        setShowPrompt(true);

        setTimeout(() => {
          setShowPrompt(false);
          sessionStorage.setItem("introSeen", "true");
        }, 8000);
      }, 600);
    };

    init();
  }, []);

  useEffect(() => {
    if (!videos.length) return;
    if (isLoading || showPrompt) return;

    const timer = setTimeout(() => {
      goToIndex(startIndex, false);
    }, 150);

    return () => clearTimeout(timer);
  }, [videos.length, startIndex, isLoading, showPrompt, goToIndex]);

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
      className="relative h-dvh overflow-hidden bg-black overscroll-none pb-24"
    >
      {videos.map((video, index) => (
        <div id={`reel-${index}`} key={video._id}>
          <ReelCard
            title={video.title}
            videoUrl={video.videoUrl}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            canPlay={!isLoading && !showPrompt}
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
            <p className="mt-2 text-sm text-zinc-400">
              Choose honestly.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {promptOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setShowPrompt(false)}
                  className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-zinc-200 backdrop-blur active:scale-95"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
          <h1 className="text-4xl font-semibold tracking-tight">
            InspireX
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Loading focus...
          </p>

          <div className="mt-6 flex gap-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.3s]" />
          </div>
        </div>
      )}

      {!isLoading && !showPrompt && <BottomNav />}
    </main>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"><h1 className="text-4xl font-semibold tracking-tight">InspireX</h1><p className="mt-3 text-sm text-zinc-400">Loading focus...</p></div>}>
      <FeedContent />
    </Suspense>
  );
}