import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

// Dummy JSON data
const userInterviews = [
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

async function Home() {
  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = allInterview.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback from the Courses You have Completed
          </p>
          <div className="flex flex-row gap-6">
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/start-monitoring">Start Study Session</Link>
          </Button>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Generate Assesment</Link>
          </Button>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Tests</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
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
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Top Company Interviews</h2>

        <div className="interviews-section">
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
    </>
  );
}

export default Home;
