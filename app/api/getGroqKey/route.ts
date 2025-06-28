// app/api/getGroqKey/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    apiKey: `${process.env.GROQ_API_KEY}`
  });
}