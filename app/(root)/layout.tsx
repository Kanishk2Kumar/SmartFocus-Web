"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ⛔ Redirect if no user and loading is complete
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in"); // redirect to sign-in
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  const initials =
    user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="SmartFocus Logo" width={38} height={32} />
          <h2 className="hidden sm:block text-primary-100">SmartFocus</h2>
        </Link>

        <div className="flex items-center justify-between gap-6">
          <Link
            href="/dashboard"
            className="text-primary-100 text-lg font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/games"
            className="text-primary-100 text-lg font-medium"
          >
            Games
          </Link>
          <Link
            href="/interview"
            className="text-primary-100 text-lg font-medium"
          >
            Custom Interview
          </Link>

          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gray-900 text-white text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </nav>

      {children}

      <div className="fixed bottom-6 right-6 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="rounded-full h-16 w-44 border border-primary-100 bg-transparent hover:bg-primary/10 mx-"
              variant="default"
            >
              <span className="text-primary-100 px-2 text-lg">Support</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-6 h-6"
              >
                <path
                  fill="#b3b3e6"
                  d="M256 80C141.1 80 48 173.1 48 288l0 104c0 13.3-10.7 24-24 24s-24-10.7-24-24L0 288C0 146.6 114.6 32 256 32s256 114.6 256 256l0 104c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-104c0-114.9-93.1-208-208-208zM80 352c0-35.3 28.7-64 64-64l16 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-64zm288-64c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32l16 0z"
                />
              </svg>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-96 h-[36rem] bg-background border shadow-xl rounded-lg flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h4 className="font-semibold">Smart Focus Assistant</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="bg-muted p-2 rounded">
                Hi! How can I help you today?
              </div>
            </div>

            <div className="p-2 border-t flex gap-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button>Send</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Layout;
