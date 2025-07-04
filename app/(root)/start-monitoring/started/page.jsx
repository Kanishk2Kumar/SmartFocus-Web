"use client";
import { useState, useEffect, useRef } from "react";
import SharedScreen from "@/components/SharedScreen";
import WebcamMonitor from "@/components/WebCamMonitor";
import MetricsPanel from "@/components/MetricsPanel";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Monitor() {
  const { user } = useAuth();
  const [durationMin, setDurationMin] = useState(10);
  const [timeLeft, setTimeLeft] = useState(durationMin * 60);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [breakTimeLeft, setBreakTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef(null);

  const [stats, setStats] = useState({
    distraction_seconds: 0,
    looked_away_count: 0,
    idle_timeout_count: 0,
    tab_switch_count: 0,
    phone_detected_count: 0,
  });

  // Initialize duration from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDuration = localStorage.getItem("duration");
      setDurationMin(savedDuration ? Number(savedDuration) : 10);
      setTimeLeft((savedDuration ? Number(savedDuration) : 10) * 60);
    }
  }, []);

  // Calculate focus percentage
  const focus_percent = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        100 - (stats.distraction_seconds / (durationMin * 60)) * 100
      )
    )
  );

  // Debugging logs
  useEffect(() => {
    console.log(
      `Focus: ${focus_percent}% | Timer: ${
        isTimerRunning ? "Running" : "Paused"
      } | Show Popover: ${showBreakPrompt}`
    );
  }, [focus_percent, isTimerRunning, showBreakPrompt]);

  // Handle focus drop below threshold
  useEffect(() => {
    if (focus_percent < 96 && !hasShownPrompt) {
      console.log("Focus dropped below 95% - showing popover");
      pauseTimer();
      setShowBreakPrompt(true);
      setHasShownPrompt(true);
    }
  }, [focus_percent, hasShownPrompt]);

  // Timer control functions
  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  // Countdown timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (typeof window !== "undefined" && window.stopMonitoring) {
              window.stopMonitoring();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Auto-end session
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof window !== "undefined" && window.stopMonitoring) {
        window.stopMonitoring();
      }
    }, durationMin * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [durationMin]);

  const handleResumeMonitoring = () => {
    setShowBreakPrompt(false);
    startTimer();
  };

  // Session saving logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.stopMonitoring = async () => {
        if (window._stopTracking) window._stopTracking();
        pauseTimer();

        const taskName = localStorage.getItem("taskName") || "Untitled Task";
        const youtube = localStorage.getItem("youtubeLink") || "https://www.youtube.com/watch?v=-UdHmSTmQtw";
        const sessionPoint = Math.round((durationMin * 60 - timeLeft) / 60);

        if (user) {
          const userPoint = user?.total_points;
          const { error } = await supabase.from("sessions").insert([
            {
              session_name: taskName,
              user_id: user.userid,
              duration_min: durationMin,
              looked_away_count: stats.looked_away_count,
              tab_switch_count: stats.tab_switch_count,
              phone_detected_count: stats.phone_detected_count,
              focus_percent,
              points : sessionPoint,
              youtube_link: youtube,
            },
          ]);

          if (error) {
            console.error("Session save error:", error);
          } else {
            console.log("Session saved successfully");
            console.log(userPoint + sessionPoint);
            const { error: updateError } = await supabase
              .from("user")
              .update({ total_points: userPoint + sessionPoint })
              .eq("id", user.id);

            if (updateError) {
              console.error("User point update error:", updateError);
            } else {
              console.log("User point updated successfully");
            }
          }
        }

        alert("Session completed!");
      };

      // Prevent all stats incrementing during break
      window.shouldMonitorStats = () => !showBreakPrompt;
    }
  }, [stats, user, durationMin, focus_percent, showBreakPrompt]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
  const breakTimerRef = useRef(null);

  useEffect(() => {
    let interval;
    if (showBreakPrompt) {
      setBreakTimeLeft(300); // Reset to 5 minutes at start of break
      interval = setInterval(() => {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showBreakPrompt]);

  return (
    <div className="space-y-6">
      {/* Break Prompt Popover */}
      <Popover open={showBreakPrompt} onOpenChange={setShowBreakPrompt}>
        <PopoverTrigger asChild>
          <span className="hidden" />
        </PopoverTrigger>
        <PopoverContent
          className="w-[500px] bg-gradient-to-br from-purple-700 to-indigo-900 text-white shadow-lg border-none rounded-xl m-4"
          side="top"
          align="center"
        >
          <div className="flex flex-col items-center gap-4 p-2 text-center">
            <h2 className="text-2xl font-bold tracking-wide">
              🚨 Focus Drop Alert!
            </h2>
            <p className="text-sm">
              Your focus dipped to{" "}
              <span className="font-semibold">{focus_percent}%</span>.
              <br /> Time for a quick{" "}
              <span className="underline">5-minute break</span> to reset!
            </p>

            <div className="text-2xl font-mono bg-black/20 rounded px-6 py-1">
              {String(Math.floor(breakTimeLeft / 60)).padStart(2, "0")}:
              {String(breakTimeLeft % 60).padStart(2, "0")}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-2">
              <Link
                href="/interview" target="_blank" rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-3 rounded-lg shadow"
              >
                🎯 Quiz
              </Link>
              <Link
                href="/games" target="_blank" rel="noopener noreferrer"
                className="bg-purple-400 hover:bg-purple-300 text-black font-semibold py-2 px-3 rounded-lg shadow"
              >
                🎮 Game
              </Link>
              <Link
                href="#"
                className="bg-blue-400 hover:bg-blue-500 text-black font-semibold py-2 px-3 rounded-lg shadow"
              >
                ☕ Break
              </Link>
            </div>

            <Button
              onClick={handleResumeMonitoring}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white text-md font-semibold"
            >
              Resume Monitoring
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-semibold text-primary-100">
          Monitoring Session
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-xl font-medium px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">
            Focus: {focus_percent}%
          </div>
          <div className="text-3xl font-mono px-3 py-1 rounded bg-blue-100 dark:bg-blue-900">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/5">
          <SharedScreen />
        </div>
        <div className="w-full lg:w-2/5">
          <WebcamMonitor stats={stats} setStats={setStats} />
        </div>
      </div>

      <MetricsPanel stats={stats} />
    </div>
  );
}
