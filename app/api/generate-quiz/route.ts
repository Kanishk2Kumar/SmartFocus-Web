import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: "Valid transcript is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate a 5-question quiz in JSON format based on this video transcript:
${transcript.substring(0, 6000)}

You MUST return valid JSON with this exact structure:
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}

Important requirements:
- Return ONLY the JSON object
- Don't include markdown or code fences
- Each question must have exactly 4 options
- Mark the correct answer clearly`;

    const completion = await groq.chat.completions.create({
      messages: [{
        role: "user",
        content: prompt
      }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from AI model");
    }

    try {
      const result = JSON.parse(content);
      if (!result.questions || !Array.isArray(result.questions)) {
        throw new Error("Invalid quiz format received");
      }
      
      // Validate each question
      const validQuestions = result.questions.filter((q: { question: any; options: string | any[]; correctAnswer: any; }) => 
        q.question && 
        q.options?.length === 4 && 
        q.correctAnswer
      );
      
      return NextResponse.json({ questions: validQuestions });
    } catch (e) {
      console.error("Failed to parse:", content);
      throw new Error("Received invalid JSON format");
    }
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Quiz generation failed",
        suggestion: "Please try again with a different video"
      },
      { status: 500 }
    );
  }
}