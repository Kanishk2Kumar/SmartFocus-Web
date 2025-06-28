"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const stats = {
    totalSessions: 6,
    S_Sessions: 5,
    TotalHours: 4,
    alerts: 1
  }

  return (
    <div className="flex gap-5">
      <Card className="h-40 w-68 ">
        <CardHeader>
          <CardDescription>Total Sessions</CardDescription>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalSessions}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1">
            <IconTrendingUp className="size-4" />
            {stats.S_Sessions} new this month
          </Badge>
        </CardFooter>
      </Card>
      <Card className="h-40 w-68">
        <CardHeader>
          <CardDescription className="text-green-600">Success Sessions</CardDescription>
          <CardTitle className="text-green-600 text-4xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {stats.S_Sessions}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1 text-green-600">
            <IconTrendingDown className="size-4" />
            Requires attention
          </Badge>
        </CardFooter>
      </Card>
      <Card className="h-40 w-68">
        <CardHeader>
          <CardDescription className="text-red-600">Failed Sessions</CardDescription>
          <CardTitle className="text-red-600 text-4xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {stats.alerts}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1 text-red-600">
            <IconTrendingDown className="size-4" />
            Requires attention
          </Badge>
        </CardFooter>
      </Card>
      <Card className="h-40 w-68">
        <CardHeader>
          <CardDescription>Total Hours Studied</CardDescription>
          <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.TotalHours}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline" className="flex items-center gap-1">
            {Math.round((stats.TotalHours / stats.totalSessions) * 100)}% more than last week
          </Badge>
        </CardFooter>
      </Card>
    </div>
  )
}
