"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

type ReelCardProps = {
  title: string;
  videoUrl: string;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ReelCard({
  title,
  videoUrl,
  isMuted,
  setIsMuted,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPaused(false);
        } else {
          video.pause();
          setIsPaused(true);
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  return (
    <section onClick={togglePlay}
    className="relative h-dvh snap-start bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        muted={isMuted}
        loop
        playsInline
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      {/* Center Play Icon */}
      {isPaused && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 p-4 backdrop-blur"
        >
          <Play className="h-8 w-8 fill-white text-white" />
        </button>
      )}

      {/* Bottom Left Title */}
      <div className="absolute bottom-10 left-4 right-16 z-20">
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
      </div>

      {/* Bottom Right Sound Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="absolute bottom-6 right-4 z-20 rounded-full bg-black/40 p-3 backdrop-blur"
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-white" />
        ) : (
          <Volume2 className="h-5 w-5 text-white" />
        )}
      </button>
    </section>
  );
}