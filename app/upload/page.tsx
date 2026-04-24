"use client";

import { useState } from "react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("motivation");

  const [videoName, setVideoName] = useState("");
  const [thumbName, setThumbName] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!title || !videoName || !thumbName) {
      setMessage("Title, video filename, and thumbnail filename are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const saveRes = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          videoUrl: `/videos/${videoName}`,
          thumbnailUrl: `/thumbnails/${thumbName}`,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save reel");
      }

      setMessage("Reel added successfully.");

      setTitle("");
      setCategory("motivation");
      setVideoName("");
      setThumbName("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to add reel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold">Add Reel</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Put files in public/videos and public/thumbnails first
        </p>

        <div className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Reel title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
          >
            <option value="motivation">Motivation</option>
            <option value="discipline">Discipline</option>
            <option value="focus">Focus</option>
            <option value="mindset">Mindset</option>
            <option value="comeback">Comeback</option>
            <option value="coding">Coding</option>
          </select>

          <input
            type="text"
            placeholder="Video filename (example.mp4)"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
          />

          <input
            type="text"
            placeholder="Thumbnail filename (example.jpg)"
            value={thumbName}
            onChange={(e) => setThumbName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-medium text-black disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Reel"}
          </button>

          {message && (
            <p className="text-sm text-zinc-300">{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}