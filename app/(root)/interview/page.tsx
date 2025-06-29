import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const allInterview = [
  {
    id: "1",
    userId: "11",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "JavaScript"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "12",
    role: "Backend Developer",
    type: "Technical",
    techstack: ["Node.js", "MongoDB"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "13",
    role: "Database Administrator",
    type: "Technical",
    techstack: ["SQL", "MongoDB"],
    createdAt: new Date().toISOString(),
  },
];

const Interview = () => {
  const hasUpcomingInterviews = allInterview.length > 0;
  return (
    <div>
    <div className="w-full flex justify-center gap-4 mt-2">
      <div className="w-full sm:w-1/2 flex flex-col">
        <section className="card-cta">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2>Generate a Personalised Assesment</h2>
            <p className="text-lg">
              Generate Custom Assesment by selecting the Company, Role & position, Tech Stack, Difficulty and Number of Questions you want to practice for.
            </p>
            <div className="flex flex-row gap-6">
              <Button asChild className="btn-primary max-sm:w-full">
                <Link href="/interview/custom-interview">Generate Custom Assesment</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <div className="w-full sm:w-1/2 flex flex-col">
        <section className="card-cta">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2>Generate Assesment based on Course</h2>
            <p className="text-lg">
              Generate Assesment based on Courses you have completed from YouTube, Udemy or Coursera. This will help you to practice the concepts you have learned in the courses.
            </p>
            <div className="flex flex-row gap-6">
              <Button asChild className="btn-primary max-sm:w-full">
                <Link href="/interview/course-based">Generate Course Based Assesment</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
    <section className="flex flex-col gap-8 mt-8">
        <h2>Top Assesments</h2>

        <div className="interviews-section gap-8">
          {hasUpcomingInterviews ? (
            allInterview.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={interview.userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Interview;
