"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type ReelCardProps = {
  title: string;
  videoUrl: string;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  canPlay: boolean;
};

export default function ReelCard({
  title,
  videoUrl,
  isMuted,
  setIsMuted,
  canPlay,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!canPlay) {
          video.pause();
          return;
        }

        if (entry.isIntersecting) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [canPlay]);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    setShowIcon(true);

    setTimeout(() => {
      setShowIcon(false);
    }, 700);
  };

  return (
    <section
      onClick={toggleSound}
      className="relative h-dvh snap-start bg-black"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        muted={isMuted}
        loop
        playsInline
        className="h-full w-full object-contain bg-black"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

      <div className="absolute bottom-24 left-4 right-4 z-10">
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
      </div>

      {showIcon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-4 backdrop-blur animate-pulse">
            {isMuted ? (
              <VolumeX className="h-7 w-7 text-white" />
            ) : (
              <Volume2 className="h-7 w-7 text-white" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}