"use client";

import { useState } from "react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("motivation");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!title || !videoFile || !thumbFile) {
      setMessage("Title, video, and thumbnail are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Upload video
      const videoForm = new FormData();
      videoForm.append("file", videoFile);

      const videoRes = await fetch("/api/upload", {
        method: "POST",
        body: videoForm,
      });

      const videoData = await videoRes.json();
      const videoUrl = videoData.data.url;

      // Upload thumbnail
      const thumbForm = new FormData();
      thumbForm.append("file", thumbFile);

      const thumbRes = await fetch("/api/upload", {
        method: "POST",
        body: thumbForm,
      });

      const thumbData = await thumbRes.json();
      const thumbnailUrl = thumbData.data.url;

      // Save reel
      await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          videoUrl,
          thumbnailUrl,
        }),
      });

      setMessage("Upload successful.");

      setTitle("");
      setCategory("motivation");
      setVideoFile(null);
      setThumbFile(null);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold">Upload Reel</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Add video + thumbnail for InspireX library
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

          <div className="rounded-xl border border-dashed border-white/15 bg-zinc-900 p-4">
            <p className="mb-2 text-sm text-zinc-400">Select Video</p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideoFile(e.target.files?.[0] || null)
              }
            />
          </div>

          <div className="rounded-xl border border-dashed border-white/15 bg-zinc-900 p-4">
            <p className="mb-2 text-sm text-zinc-400">Select Thumbnail</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setThumbFile(e.target.files?.[0] || null)
              }
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-medium text-black disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Reel"}
          </button>

          {message && (
            <p className="text-sm text-zinc-300">{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}