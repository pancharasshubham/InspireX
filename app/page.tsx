"use client";

import { useEffect, useState } from "react";

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
        <section
          key={video._id}
          style={{
            height: "100vh",
            position: "relative",
            scrollSnapAlign: "start",
            backgroundColor: "black",
          }}
        >
          <video
            src={video.videoUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
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
            <h2>{video.title}</h2>
            <p>{video.category}</p>
          </div>
        </section>
      ))}
    </main>
  );
}