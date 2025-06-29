"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatPopover } from "../../components/popover";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount({ namespace: "eip155" });

  // Redirect if no user and loading is complete
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
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

        <div className="flex items-center justify-between gap-5">
          <Link href="/dashboard" className="text-primary-100 text-lg font-medium">
            Dashboard
          </Link>
          <Link href="/games" className="text-primary-100 text-lg font-medium">
            Games
          </Link>
          <Link href="/interview" className="text-primary-100 text-lg font-medium">
            Custom Assesment
          </Link>

          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gray-900 text-white text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>

          <Button onClick={() => open({ view: isConnected ? "Account" : "Connect", namespace: "eip155" })}>
            {isConnected ? 
              `${address?.slice(0, 6)}...${address?.slice(-4)}` : 
              "Connect Wallet"
            }
          </Button>
        </div>
      </nav>

      {children}

      <div className="fixed bottom-6 right-6 z-50">
        <ChatPopover />
      </div>
    </div>
  );
};

export default Layout;
