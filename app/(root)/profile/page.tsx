"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/client";

const Profile = () => {
  const { user, session } = useAuth();
  const router = useRouter();
  const [helpedCount, setHelpedCount] = useState(0);

  useEffect(() => {
    if (!session) {
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    }
  }, [session, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };


  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-4xl font-bebas-neue">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <Card className="px-48">
        <CardHeader>
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src="/path-to-user-avatar.jpg" alt="User Avatar" />
            <AvatarFallback className="text-4xl">
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-center mt-4">
            {user?.name || "User"}
          </CardTitle>
          <CardDescription className="text-center text-sm text-primary-200">
            {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-200">Total Points :</h3>
            <p>{user.total_points}</p>
          </div>
          <div className="col-span-2 space-y-2">
            <Button onClick={handleSignOut} className="bg-purple-500 text-white rounded hover:bg-purple-600 w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;