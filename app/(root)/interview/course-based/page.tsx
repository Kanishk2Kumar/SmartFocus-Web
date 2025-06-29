"use client"; // Add this line at the very top

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { generateQuizFromUrl, QuizQuestion } from "@/lib/generate-quiz";

const CourseBased = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // Add this line
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async () => {
  if (!url.trim()) {
    setError("Please enter a YouTube URL");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // Get transcript
    const transcriptRes = await fetch('/api/get-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const transcriptData = await transcriptRes.json();
    
    if (!transcriptRes.ok || !transcriptData.transcript) {
      throw new Error(
        transcriptData.error || 
        "Could not get transcript. Try a different video."
      );
    }

    // Generate quiz
    const quizRes = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: transcriptData.transcript }),
    });

    const quizData = await quizRes.json();
    
    if (!quizRes.ok) {
      throw new Error(quizData.error || "Failed to generate quiz");
    }

    setQuestions(quizData.questions || []);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to generate quiz");
  } finally {
    setLoading(false);
  }
};

  const handleAnswerSelect = (qIndex: number, option: string) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const submitQuiz = () => {
    const correct = questions.reduce((count, q, index) => (
      answers[index] === q.correctAnswer ? count + 1 : count
    ), 0);
    setScore(Math.round((correct / questions.length) * 100));
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setUrl("");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-black rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold">Course Assessment Generator</h1>
        
        <p className="text-gray-600">
          Generate quizzes from YouTube, Udemy, or Coursera content to test your knowledge.
        </p>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter course/video URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={generateQuiz}
              disabled={loading}
              className="min-w-[150px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {questions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Quiz ({questions.length} Questions)
            </h2>

            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border rounded-lg p-4">
                  <p className="font-medium mb-3">{qIndex + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => {
                      const isSelected = answers[qIndex] === option;
                      const isCorrect = submitted && option === q.correctAnswer;
                      const isWrong = submitted && isSelected && !isCorrect;

                      return (
                        <label
                          key={oIndex}
                          className={`flex items-center p-2 rounded cursor-pointer ${
                            isCorrect ? "bg-black-50" :
                            isWrong ? "bg-black-50" :
                            "hover:bg-black-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(qIndex, option)}
                            disabled={submitted}
                            className="mr-2"
                          />
                          <span className={`
                            ${isCorrect ? "text-green-600 font-medium" : ""}
                            ${isWrong ? "text-red-600 line-through" : ""}
                          `}>
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!submitted ? (
              <Button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== questions.length}
                className="w-full"
              >
                Submit Answers
              </Button>
            ) : (
              <div className="p-4 bg-black-50 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Score: {score}%</h3>
                <p className="mb-4">
                  {score >= 80 ? "Excellent!" :
                   score >= 60 ? "Good job!" : "Keep practicing!"}
                </p>
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="w-full"
                >
                  Start New Quiz
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBased;