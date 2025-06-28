"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  const data = [
    {
      title: "Tetris",
      description:
        "A classic puzzle video game where players manipulate falling tetrominoes.",
      link: "/games/tetris",
    },
    {
      title: "Memory Game",
      description:
        "Classic Memory game in which you have to find the two same cards too",
      link: "/games/memory_game",
    },
    {
      title: "2048 Game",
      description:
        "Classic 2048 Game, merge numbes to form a greater number , achieve 2048",
      link: "/games/2048",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl text-primary-200 font-semibold mb-6">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent>
              <CardTitle className="text-xl text-primary-200">
                {item.title}
              </CardTitle>
              <CardDescription className="pt-4 h-16">
                {item.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={item.link}>
                <Button className="transition-all duration-200 active:scale-95 hover:scale-105 hover:bg-purple-300">
                  Play Game
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
