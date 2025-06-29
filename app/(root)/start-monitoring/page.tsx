"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabase from "@/lib/client";
import { useAuth } from "@/context/AuthContext";
import PayButton from "@/components/PayButton";

interface Session {
  id: string;
  session_name: string;
  started_at: string;
  ended_at: string;
  focus_percent: number;
}

export default function CreateSessionPage() {
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState(10); // in minutes
  const [youtubeLink, setYoutubeLink] = useState("");
  const { user } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const handleStartSession = () => {
    if (!taskName || duration <= 0) {
      alert("Please provide a valid session name and duration.");
      return;
    }

    localStorage.setItem("taskName", taskName);
    localStorage.setItem("duration", duration.toString());
    localStorage.setItem("youtubeLink", youtubeLink);

    window.location.href = "/start-monitoring/started";
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const getFocusPercent = (
    start: string,
    end: string,
    distractions: number
  ) => {
    const durationMin =
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60);
    if (durationMin === 0) return "N/A";
    const focus = Math.max(0, 100 - (distractions / durationMin) * 10);
    return `${focus.toFixed(0)}%`;
  };

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("user_id", user.userid)
          .order("started_at", { ascending: false });

        console.log("Fetched sessions:", data);
        if (error) {
          console.error("Supabase fetch error:", error);
          return;
        }

        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          return;
        }

        setSessions(data);
      } catch (err) {
        console.error("Unexpected error while fetching sessions:", err);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, [user]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle className="font-mona-sans text-xl">
            Create Monitoring Session
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-row gap-6">
            <div className="space-y-4 w-1/2">
              <div>
                <Label htmlFor="taskName" className="mb-2">
                  Session Name
                </Label>
                <Input
                  id="taskName"
                  placeholder="e.g., Math Practice"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="duration" className="mb-2">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="youtubeLink" className="mb-2">
                  YouTube Link (Optional)
                </Label>
                <Input
                  id="youtubeLink"
                  placeholder="Link of YouTube video you are studying from"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
              </div>
            </div>
            <div className="w-1/2">
              <PayButton />
            </div>
          </div>
          <Button onClick={handleStartSession} className="mt-4">
            Start Monitoring
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle className="font-mona-sans text-xl">
            Previous Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {loadingSessions ? (
            <p className="text-muted-foreground">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="italic text-xs text-muted">
              No previous sessions found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Ended At</TableHead>
                  <TableHead>Focus %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.session_name}</TableCell>
                    <TableCell>{formatDate(session.started_at)}</TableCell>
                    <TableCell>{formatDate(session.ended_at)}</TableCell>
                    <TableCell>{session.focus_percent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
