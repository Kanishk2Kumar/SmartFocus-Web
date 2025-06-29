"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/client";

export function SectionCards() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    successSessions: 0,
    failedSessions: 0,
    totalHours: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.rpc("get_focus_data_by_date", {
        user_uuid: user?.userid,
      });

      if (error) {
        console.error("Error fetching focus stats:", error);
        return;
      }

      const totalSessions = data.length;

      const successSessions = data.filter(
        (d : any) => d.avg_focus_percent >= 60
      ).length;

      const failedSessions = data.filter(
        (d : any) => d.avg_focus_percent < 60
      ).length;

      const totalHours = totalSessions;

      setStats({
        totalSessions,
        successSessions,
        failedSessions,
        totalHours,
      });
    }

    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="flex gap-5 flex-wrap">
      <Card className="h-40 w-68">
        <CardHeader>
          <CardDescription>Total Sessions</CardDescription>
          <CardTitle className="text-4xl font-semibold tabular-nums">
            {stats.totalSessions}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1">
            <IconTrendingUp className="size-4" />
            {stats.successSessions} successful
          </Badge>
        </CardFooter>
      </Card>

      <Card className="h-40 w-68">
        <CardHeader>
          <CardDescription className="text-green-600">
            Success Sessions
          </CardDescription>
          <CardTitle className="text-green-600 text-4xl font-semibold tabular-nums">
            {stats.successSessions}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1 text-green-600">
            <IconTrendingUp className="size-4" />
            {((stats.successSessions / (stats.totalSessions || 1)) * 100).toFixed(1)}% success
          </Badge>
        </CardFooter>
      </Card>

      <Card className="h-40 w-68">
        <CardHeader>
          <CardDescription className="text-red-600">Failed Sessions</CardDescription>
          <CardTitle className="text-red-600 text-4xl font-semibold tabular-nums">
            {stats.failedSessions}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1 text-red-600">
            <IconTrendingDown className="size-4" />
            Needs focus
          </Badge>
        </CardFooter>
      </Card>

      <Card className="h-40 w-68">
        <CardHeader>
          <CardDescription>Total Hours Studied</CardDescription>
          <CardTitle className="text-4xl font-semibold tabular-nums">
            {stats.totalHours}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1">
            {stats.totalHours > 0 ? `${Math.round((stats.totalHours / stats.totalSessions) * 100)}% productive` : "N/A"}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}