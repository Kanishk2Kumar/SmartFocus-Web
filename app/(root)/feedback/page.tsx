import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, CheckCircle2, XCircle, AlertCircle, Clock, Target, Brain, MessageSquare } from 'lucide-react';

const Feedback = () => {
  const overallScore = 78;
  const interviewDate = "January 15, 2025";
  const position = "Senior Full Stack Developer";
  const interviewer = "Sarah Johnson";

  const categories = [
    { 
      name: "Technical Skills", 
      score: 85, 
      icon: Brain,
      feedback: "Strong understanding of React and Next.js. Demonstrated excellent problem-solving abilities.",
      color: "text-green-500"
    },
    { 
      name: "Communication", 
      score: 75, 
      icon: MessageSquare,
      feedback: "Clear articulation of ideas. Could improve on brevity when explaining complex concepts.",
      color: "text-blue-500"
    },
    { 
      name: "Problem Solving", 
      score: 80, 
      icon: Target,
      feedback: "Approached challenges methodically. Good use of pseudocode before implementation.",
      color: "text-purple-500"
    },
    { 
      name: "Time Management", 
      score: 70, 
      icon: Clock,
      feedback: "Completed most tasks within allocated time. Spent slightly too long on optimization.",
      color: "text-orange-500"
    }
  ];

  const strengths = [
    "Excellent knowledge of modern React patterns and hooks",
    "Strong understanding of TypeScript and type safety",
    "Good grasp of performance optimization techniques",
    "Clear communication of technical concepts"
  ];

  const improvements = [
    "Practice explaining solutions more concisely",
    "Strengthen knowledge of system design patterns",
    "Improve time allocation for coding challenges"
  ];

  const keyInsights = [
    { label: "Response Time", value: "< 2 sec", trend: "up", status: "success" },
    { label: "Code Quality", value: "85%", trend: "up", status: "success" },
    { label: "Questions Asked", value: "8", trend: "neutral", status: "neutral" },
    { label: "Completion Rate", value: "90%", trend: "up", status: "success" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Interview Feedback</h1>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2 text-sm">
            Recommended for Next Round
          </Badge>
        </div>
        <p className="text-gray-400">Detailed analysis and recommendations from your interview</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{overallScore}%</div>
              <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Above average</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-white">{position}</div>
              <div className="text-sm text-gray-400 mt-2">{interviewDate}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Interviewer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-white">{interviewer}</div>
              <div className="text-sm text-gray-400 mt-2">Senior Tech Lead</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">8m</div>
              <div className="text-sm text-gray-400 mt-2">of 60m scheduled</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Key Insights</CardTitle>
            <CardDescription>Quick overview of your performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {keyInsights.map((insight, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-sm text-gray-400">{insight.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{insight.value}</span>
                    {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Breakdown</CardTitle>
            <CardDescription>Detailed evaluation across key competencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${category.color}`} />
                      <span className="font-medium text-white">{category.name}</span>
                    </div>
                    <span className="text-xl font-bold text-white">{category.score}%</span>
                  </div>
                  <Progress value={category.score} className="h-2 bg-zinc-800" />
                  <p className="text-sm text-gray-400 pl-8">{category.feedback}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <CardTitle className="text-white">Key Strengths</CardTitle>
              </div>
              <CardDescription>What you excelled at during the interview</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-white">Areas for Improvement</CardTitle>
              </div>
              <CardDescription>Suggestions to enhance your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Overall Comments */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Interviewer's Comments</CardTitle>
            <CardDescription>Final remarks and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              The candidate demonstrated strong technical capabilities and a solid understanding of modern web development practices. 
              Their approach to problem-solving was methodical and well-structured. Communication skills are good, though there's 
              room for improvement in explaining complex solutions more concisely. Overall, the candidate shows great potential 
              and would be a valuable addition to the team. I recommend moving forward with the next round of interviews.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">You've been shortlisted for the system design round</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Our HR team will contact you within 2-3 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Review the areas for improvement to prepare better</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;