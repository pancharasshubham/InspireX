"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("motivation");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Title and file required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      const videoUrl = uploadData.data.url;

      await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          videoUrl,
          category,
        }),
      });

      alert("Video uploaded successfully");

      setTitle("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Upload Video</h1>

      <input
        type="text"
        placeholder="Video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="motivation">Motivation</option>
        <option value="discipline">Discipline</option>
        <option value="mindset">Mindset</option>
      </select>

      <br /><br />

      <input
        type="file"
        accept="video/*"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </main>
  );
}