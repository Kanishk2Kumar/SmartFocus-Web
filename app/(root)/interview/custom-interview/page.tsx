"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const cardButtonStyle =
  "min-w-[120px] text-md px-6 py-3 rounded-xl border border-input shadow-sm hover:bg-accent transition-all";

const CustomInterview = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      language: formData.get("language"),
      company: formData.get("company"),
      role: formData.get("role"),
      techstack: formData.get("techstack"),
      difficulty: formData.get("difficulty"),
      questions: formData.get("questions"),
      assessmentType: formData.get("assessmentType"), // Add this
    };
    // Store the data in session storage for the next page
    sessionStorage.setItem("interviewParams", JSON.stringify(data));

    // Redirect based on assessment type
    if (data.assessmentType === "Text Based") {
      router.push("/interview/text-based");
    } else {
      router.push("/interview/voice-based");
    }
  };

  return (
    <div>
      <section className="card-cta">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h2>Generate a Personalised Assesment</h2>
          <p className="text-lg">
            Customize the Assesment by selecting the Company, Role & position,
            Tech Stack, Difficulty and Number of Questions you want to practice
            For.
          </p>

          {/* Language Cards */}
          <div className="w-full flex flex-col gap-3">
            <h3>Choose the Language :</h3>
            <div className="flex flex-wrap gap-4">
              {["English", "Hindi", "Marathi", "Spanish", "French"].map(
                (lang) => (
                  <label key={lang}>
                    <input
                      type="radio"
                      name="language"
                      value={lang}
                      className="hidden peer"
                      defaultChecked={lang === "English"}
                    />
                    <div
                      className={`${cardButtonStyle} peer-checked:border-white peer-checked:text-purple-300 cursor-pointer`}
                    >
                      {lang}
                    </div>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Company Name */}
          <div className="w-full flex flex-row gap-6">
            <h3>Enter the Company Name :</h3>
            <Input
              name="company"
              type="text"
              placeholder="Enter Company Name"
              className="w-2/3"
              required
            />
          </div>

          {/* Role */}
          <div className="w-full flex flex-row gap-6">
            <h3>Choose the Role :</h3>
            <Input
              name="role"
              type="text"
              placeholder="Enter the Role You want to Apply For"
              className="w-2/3"
              required
            />
          </div>

          {/* TechStack */}
          <div className="w-full flex flex-col gap-3">
            <h3>Select the TechStack :</h3>
            <div className="flex flex-wrap gap-4">
              {["React", "Node.js", "Python", "Java"].map((tech) => (
                <label key={tech}>
                  <input
                    type="radio"
                    name="techstack"
                    value={tech}
                    className="hidden peer"
                  />
                  <div
                    className={`${cardButtonStyle} peer-checked:border-white peer-checked:text-purple-300 cursor-pointer`}
                  >
                    {tech}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="w-full flex flex-col gap-3">
            <h3>Select the Difficulty :</h3>
            <div className="flex flex-wrap gap-4">
              {["Easy", "Medium", "Hard"].map((level) => (
                <label key={level}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    className="hidden peer"
                    defaultChecked={level === "Medium"}
                  />
                  <div
                    className={`${cardButtonStyle} peer-checked:border-white peer-checked:text-purple-300 cursor-pointer`}
                  >
                    {level}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <h3>Select Assessment Type :</h3>
            <div className="flex flex-wrap gap-4">
              {["Text Based", "Voice Based"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="assessmentType" // Changed from "difficulty"
                    value={type}
                    className="hidden peer"
                    defaultChecked={type === "Text Based"} // Set your default
                  />
                  <div
                    className={`${cardButtonStyle} peer-checked:border-white peer-checked:text-purple-300 cursor-pointer`}
                  >
                    {type}
                  </div>
                </label>
              ))}
            </div>
          </div>
          {/* Number of Questions */}
          <div className="w-full flex flex-row gap-7">
            <h3 className="text-md font-semibold">Number of Questions</h3>
            <Select name="questions" required>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex flex-row gap-6">
            <Button type="submit" className="btn-primary max-sm:w-full">
              Generate Assesment
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CustomInterview;