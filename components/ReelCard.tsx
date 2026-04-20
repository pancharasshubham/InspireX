"use client";

import { useEffect, useRef, useState } from "react";

type ReelCardProps = {
  title: string;
  category: string;
  videoUrl: string;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ReelCard({
  title,
  category,
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
        } else {
          video.pause();
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
    <section
      style={{
        height: "100vh",
        position: "relative",
        scrollSnapAlign: "start",
        backgroundColor: "black",
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        muted={isMuted}
        loop
        playsInline
        onClick={togglePlay}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "16px",
          color: "white",
          background: "rgba(0,0,0,0.4)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <h2>{title}</h2>
        <p>{category}</p>

        <button type="button" onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
        }}
        >
            {isMuted ? "Unmute" : "Mute"}
        </button>

        <button onClick={togglePlay}>
          {isPaused ? "Play" : "Pause"}
        </button>
      </div>
    </section>
  );
}