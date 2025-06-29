// app/api/get-transcript/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
    
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Get video details
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const data = await res.json();

    if (!data.items?.length) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Use description as fallback transcript
    const transcript = data.items[0].snippet.description || '';
    
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Transcript error:", error);
    return NextResponse.json(
      { error: "Failed to get transcript" },
      { status: 500 }
    );
  }
}