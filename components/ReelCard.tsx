"use client";

import { useEffect, useRef } from "react";

type ReelCardProps = {
  title: string;
  category: string;
  videoUrl: string;
};

export default function ReelCard({
  title,
  category,
  videoUrl,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
        muted
        loop
        playsInline
        controls
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
      </div>
    </section>
  );
}