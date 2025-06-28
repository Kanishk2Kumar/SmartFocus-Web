import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const CourseBased = () => {
  return (
    <div>
      <section className="card-cta">
        <div className="flex flex-col gap-6">
          <h2>Generate Assesment based on Course Links</h2>
          <p className="text-lg">
            Generate Assesment based on Courses you have completed from YouTube,
            Udemy or Coursera. This will help you to practice the concepts you
            have learned in the courses.
          </p>
          <h3>Upload Course/Video Link:</h3>
          <div className="flex flex-row gap-6">
            <Input
              type="text"
              placeholder="Enter Course Link"
              className="w-3/4"
            />
            <Button className="btn-primary w-1/5">
              Generate Assesment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseBased;
