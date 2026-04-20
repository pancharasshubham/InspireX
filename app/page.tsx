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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        setVideos(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading InspireX...</p>;

  return (
    <main style={{ padding: "20px" }}>
      <h1>InspireX</h1>

      {videos.map((video) => (
        <div
          key={video._id}
          style={{
            marginBottom: "24px",
            border: "1px solid #ddd",
            padding: "12px",
          }}
        >
          <h3>{video.title}</h3>
          <p>{video.category}</p>

          <video
            src={video.videoUrl}
            controls
            width="320"
          />
        </div>
      ))}
    </main>
  );
}