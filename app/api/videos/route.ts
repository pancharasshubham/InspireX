import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const newVideo = await Video.create({
        title: body.title,
        videoUrl: body.videoUrl,
        category: body.category,
    });

    return NextResponse.json({
        success: true,
        message: "Video created successfully",
        data: newVideo,
    },
    { status: 201 }
    ); 

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to create video" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();  

    const videos = await Video.find().sort({ createdAt: -1 });

    return NextResponse.json({
        success: true,
        count: videos.length,
        data: videos,
    });     
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}