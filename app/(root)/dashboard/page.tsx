"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SectionCards } from "@/components/section-cards";
import supabase from "@/lib/client";
import { useAuth } from "@/context/AuthContext";

const PiechartData = [
  { browser: "Tabs Switched", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Looked Away", visitors: 200, fill: "var(--color-safari)" },
  { browser: "Stayed Idle", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "Absent", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(210, 100%, 85%)", // bright blue
  },
  safari: {
    label: "Safari",
    color: "hsl(210, 100%, 65%)", // mid blue
  },
  firefox: {
    label: "Firefox",
    color: "hsl(210, 100%, 45%)", // darker blue
  },
  edge: {
    label: "Edge",
    color: "hsl(210, 90%, 35%)", // navy-ish
  },
  other: {
    label: "Other",
    color: "hsl(210, 70%, 15%)", 
  },
};

// Bar Chart Data
const BarchartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
const BarchartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
};

// Area CHart
const AreachartData = [
  { date: "23", desktop: 14 },
  { date: "25", desktop: 16 },
  { date: "26", desktop: 15 },
  { date: "27", desktop: 17 },
  { date: "28", desktop: 13 },
  { date: "29", desktop: 19 },
  { date: "30", desktop: 18 },
];
const AreachartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-primary-200)",
  },
};

// Radar Chart
const RadarchartData = [
  { month: "Enthusiasm", desktop: 186 },
  { month: "Communication", desktop: 305 },
  { month: "Technical Skills", desktop: 237 },
  { month: "Soft Skills", desktop: 273 },
  { month: "Awareness", desktop: 209 },
];
const RadarchartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-primary-200)",
  },
};

const FocusLineChart = () => {
  const { user } = useAuth();
  const [focusData, setFocusData] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);
  const [averageFocus, setAverageFocus] = React.useState(0);

  async function fetchFocusData() {
    const { data, error } = await supabase.rpc("get_focus_data_by_date", {
      user_uuid: user?.userid,
    });

    if (error) {
      console.error("Error fetching focus data:", error);
      return;
    }

    console.log(data);

    setFocusData(data);

    const formattedChartData = data.map((item: any) => ({
      date: item.date,
      focus: item.avg_focus_percent,
    }));
    setChartData(formattedChartData);

    const avg =
      data.reduce((acc: any, item: any) => acc + item.avg_focus_percent, 0) /
      (data.length || 1);
    setAverageFocus(avg);
  }

  React.useEffect(() => {
    fetchFocusData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <SectionCards />
      <div>
        <Card className="py-4 sm:py-0">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
              <CardTitle>Focus % Over Time</CardTitle>
              <CardDescription>
                Showing daily average focus percent for the last month
              </CardDescription>
            </div>
            <div className="flex">
              <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
                <span className="text-muted-foreground text-xs">
                  Average Focus
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {averageFocus.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={{
                focus: {
                  label: "Focus %",
                  color: "var(--color-primary-200)",
                },
              }}
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  domain={[60, 80]}
                  tickCount={5}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="focus"
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    />
                  }
                />
                <Line
                  dataKey="focus"
                  type="monotone"
                  stroke="var(--color-primary-200)"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="w-full flex justify-center gap-4">
        <Card className="w-full sm:w-1/2 flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Distractions Breakdown</CardTitle>
            <CardDescription>Know How Often are you distracted</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto w-full aspect-square max-w-[250px] [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={PiechartData}
                  dataKey="visitors"
                  label
                  nameKey="browser"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="w-full sm:w-1/2 flex flex-col">
          <CardHeader>
            <CardTitle>Focus Status</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={BarchartConfig}>
              <BarChart accessibilityLayer data={BarchartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="desktop"
                  fill="var(--color-primary-100)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="w-full flex justify-center gap-4">
        <Card className="w-full sm:w-1/2 flex flex-col">
          <CardHeader>
            <CardTitle>Interview Scores</CardTitle>
            <CardDescription>
              Know How you performed in past interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={AreachartConfig}>
              <AreaChart
                accessibilityLayer
                data={AreachartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" hideLabel />}
                />
                <Area
                  dataKey="desktop"
                  type="linear"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="w-full sm:w-1/2 flex flex-col">
          <CardHeader className="items-center">
            <CardTitle>Your Strengths</CardTitle>
            <CardDescription>
              Know the areas where you excel and where you can improve, based on
              past interviews
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer config={RadarchartConfig} className="mx-auto">
              <RadarChart data={RadarchartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis dataKey="month" />
                <PolarGrid />
                <Radar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  fillOpacity={0.6}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FocusLineChart;
