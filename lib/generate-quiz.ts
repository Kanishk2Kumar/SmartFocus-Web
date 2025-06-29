import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
});

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export const generateQuizFromUrl = async (url: string): Promise<QuizQuestion[]> => {
  if (!url) throw new Error("URL is required");
  if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    throw new Error("API key not configured - please refresh the page");
  }

  const prompt = `
    Generate a 10-question quiz based on this course/video: ${url}.
    Requirements:
    1. Questions should cover key concepts
    2. Each question must have 4 options (a, b, c, d)
    3. Clearly mark the correct answer
    4. Format as valid JSON
    
    Example format:
    {
      "questions": [
        {
          "question": "What is React?",
          "options": [
            "A backend framework",
            "A JavaScript library for building UIs",
            "A database system",
            "A programming language"
          ],
          "correctAnswer": "A JavaScript library for building UIs"
        }
      ]
    }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      response_format: { type: "json_object" },
      temperature: 0.5
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No content in response");

    const result = JSON.parse(content);
    const questions: QuizQuestion[] = result.questions || [];

    return questions
      .filter(q => q.question && q.options?.length === 4 && q.correctAnswer)
      .slice(0, 10)
      .map(q => ({
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctAnswer: q.correctAnswer.trim()
      }));
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw new Error("Failed to generate quiz. Please try again later.");
  }
};