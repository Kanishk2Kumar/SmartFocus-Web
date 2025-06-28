"use client";
import { useState, useEffect } from "react";
import SharedScreen from "@/components/SharedScreen";
import WebcamMonitor from "@/components/WebCamMonitor";
import MetricsPanel from "@/components/MetricsPanel";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/client";

export default function Monitor() {
  const { user } = useAuth();

  // Retrieve duration in minutes, default to 10
  const durationMin = Number(localStorage.getItem("duration") || 10);

  // Initialize total time (in seconds) and countdown state
  const [timeLeft, setTimeLeft] = useState(durationMin * 60);

  const [stats, setStats] = useState({
    distraction_seconds: 0,
    looked_away_count: 0,
    idle_timeout_count: 0,
    tab_switch_count: 0,
    phone_detected_count: 0,
  });

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [durationMin]);

  // Auto-stop when timer hits zero
  useEffect(() => {
    if (timeLeft === 0 && window.stopMonitoring) {
      window.stopMonitoring();
    }
  }, [timeLeft]);

  // Auto-end session based on duration (redundant but preserves existing logic)
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("⏳ Auto-ending session after time limit");
      if (window.stopMonitoring) window.stopMonitoring();
    }, durationMin * 60 * 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Save session data on stop
  useEffect(() => {
    window.stopMonitoring = async () => {
      if (window._stopTracking) window._stopTracking();

      const taskName = localStorage.getItem("taskName") || "Untitled";
      const duration = durationMin; // in minutes

      const {
        distraction_seconds,
        looked_away_count,
        tab_switch_count,
        phone_detected_count,
      } = stats;

      const focus_percent = Math.round(
        Math.max(
          0,
          Math.min(100, 100 - (distraction_seconds / (duration * 60)) * 100)
        )
      );

      if (user) {
        const { error } = await supabase.from("sessions").insert([
          {
            session_name: taskName,
            user_id: user.userid,
            duration_min: duration,
            looked_away_count,
            tab_switch_count,
            phone_detected_count,
            focus_percent,
          },
        ]);

        if (error) {
          console.error("❌ Failed to save session:", error);
        } else {
          console.log("✅ Session saved successfully");
        }
      } else {
        console.warn("⚠️ No user logged in. Session not saved.");
      }

      alert("✅ Session ended!");
    };
  }, [stats, user]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-semibold text-primary-100">
          Monitoring In Progress
        </h2>
        <span className="text-3xl font-mono px-3 py-1 rounded">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex flex-row gap-6">
        <div className="w-3/5">
          <SharedScreen />
        </div>
        <div>
          <WebcamMonitor stats={stats} setStats={setStats} />
        </div>
      </div>
      <MetricsPanel stats={stats} />
    </div>
  );
}
