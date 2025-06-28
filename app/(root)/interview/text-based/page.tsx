"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface InterviewParams {
  language: string;
  company: string;
  role: string;
  techstack: string;
  difficulty: string;
  questions: string;
  assessmentType: string;
}

interface Question {
  question: string;
  expectedAnswer: string;
}

interface Answer {
  question: string;
  userAnswer: string;
  evaluation: string;
  score: number;
}

export default function TextBasedInterview() {
  const router = useRouter();
  const [interviewParams, setInterviewParams] = useState<InterviewParams | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = sessionStorage.getItem("interviewParams");
    if (params) {
      setInterviewParams(JSON.parse(params));
      generateQuestions(JSON.parse(params));
    } else {
      router.push("/interview/custom-interview");
    }
  }, [router]);

  const generateQuestions = async (params: InterviewParams) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!process.env.GROQ_API_KEY) {
        throw new Error("API key not found - please check your .env file");
      }

      const prompt = `
        Generate ${params.questions} technical interview questions for a ${params.role} position.
        Technology: ${params.techstack}
        Difficulty: ${params.difficulty}
        Company: ${params.company}
        Return ONLY JSON format: [{"question":"...","expectedAnswer":"..."}]
        Ensure the response contains no formatting characters outside the JSON structure.
      `;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{
            role: "user",
            content: prompt
          }],
          temperature: 0.7,
          response_format: { type: "json_object" },
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Details:", errorData);
        throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      console.log("Raw API response:", content); // Debugging

      // Clean the response before parsing
      const cleanedContent = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      // Parse the response
      const parsedResponse = JSON.parse(cleanedContent);
      
      // Handle cases where the response might be an object containing the array
      const questions = Array.isArray(parsedResponse) 
        ? parsedResponse 
        : parsedResponse.questions || parsedResponse.result || [];
      
      if (!questions.length) {
        throw new Error("No questions were generated. Please try again.");
      }

      setQuestions(questions);

    } catch (error: any) {
      console.error("Full Error:", error);
      setError(`Failed to generate questions. Please try again. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateAnswer = async (question: string, expectedAnswer: string, userAnswer: string) => {
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("API key not configured in .env file");
      }

      const prompt = `
        Evaluate this technical interview answer on a scale of 0-100 based on accuracy and completeness.
        Provide detailed feedback and a numeric score.
        Return ONLY JSON with format: {"score": number, "feedback": string}
        Ensure the response contains no formatting characters outside the JSON structure.

        Question: ${question}
        Expected Answer: ${expectedAnswer}
        User Answer: ${userAnswer}
      `;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          response_format: { type: "json_object" },
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Evaluation failed");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      // Clean the response before parsing
      const cleanedContent = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleanedContent);

    } catch (error: any) {
      console.error("Error evaluating answer:", error);
      throw new Error(`Failed to evaluate answer: ${error.message}`);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const evaluation = await evaluateAnswer(
        questions[currentQuestionIndex].question,
        questions[currentQuestionIndex].expectedAnswer,
        userAnswer
      );

      const newAnswer: Answer = {
        question: questions[currentQuestionIndex].question,
        userAnswer,
        evaluation: evaluation.feedback,
        score: evaluation.score
      };

      setAnswers([...answers, newAnswer]);
      setUserAnswer("");

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishInterview([...answers, newAnswer]);
      }
    } catch (error: any) {
      console.error("Error submitting answer:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishInterview = (allAnswers: Answer[]) => {
    const totalScore = allAnswers.reduce((sum, answer) => sum + answer.score, 0);
    const averageScore = Math.round(totalScore / allAnswers.length);
    setOverallScore(averageScore);
    setIsFinished(true);
    sessionStorage.setItem("interviewResults", JSON.stringify({
      params: interviewParams,
      answers: allAnswers,
      overallScore: averageScore
    }));
  };

  const restartInterview = () => {
    router.push("/interview/custom-interview");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-xl">Generating your interview questions...</p>
        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Interview Results</h1>
        <div className="bg-primary/10 p-4 md:p-6 rounded-lg mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Overall Score: <span className="text-primary">{overallScore}/100</span>
          </h2>
          <p className="text-md md:text-lg">
            You completed the {interviewParams?.difficulty.toLowerCase()} level interview for {interviewParams?.role} at {interviewParams?.company}.
          </p>
        </div>

        <div className="space-y-6">
          {answers.map((answer, index) => (
            <div key={index} className="border rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Question {index + 1}: {answer.question}
              </h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Your Answer:</h4>
                <p className="mt-1 p-3 rounded whitespace-pre-wrap">{answer.userAnswer}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Evaluation:</h4>
                <p className="mt-1 p-3 rounded">{answer.evaluation}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Score:</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      answer.score >= 80 ? 'bg-green-500' :
                      answer.score >= 60 ? 'bg-blue-500' :
                      answer.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${answer.score}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1 font-medium">{answer.score}/100</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={restartInterview} 
            className="px-6 py-3 text-md"
            variant="outline"
          >
            Start New Interview
          </Button>
          <Button 
            onClick={() => window.print()} 
            className="px-6 py-3 text-md"
          >
            Print Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          {interviewParams?.company} - {interviewParams?.role} Interview
        </h1>
        <div className="bg-primary/10 px-3 py-1 rounded-full text-sm md:text-base">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4 md:p-6 mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
          {questions[currentQuestionIndex]?.question}
        </h2>
        
        <div className="space-y-3">
          <label htmlFor="answer" className="block font-medium">
            Your Answer:
          </label>
          <Textarea
            id="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full min-h-[150px] md:min-h-[200px] p-4"
            placeholder="Type your answer here..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmitAnswer}
          disabled={!userAnswer.trim() || isSubmitting}
          className="px-6 py-3 text-md w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentQuestionIndex < questions.length - 1 ? "Submitting..." : "Finalizing..."}
            </>
          ) : (
            currentQuestionIndex < questions.length - 1 ? "Submit & Next" : "Submit & Finish"
          )}
        </Button>
      </div>
    </div>
  );
}