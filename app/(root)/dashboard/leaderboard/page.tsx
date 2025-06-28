"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/lib/client";


const Leaderboard = () => {
  const [users, setUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .order("total_points", { ascending: false });

        if (error) throw error;

        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading leaderboard...</div>;
  }

  const getMedal = (rank: number) => {
    if (rank === 1) return "🥇"; // Gold
    if (rank === 2) return "🥈"; // Silver
    if (rank === 3) return "🥉"; // Bronze
    return null;
  };

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>
      <div className="max-w-2xl mx-auto">
        <div className="border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="grid grid-cols-3 font-semibold">
              <div>Rank</div>
              <div>Name</div>
              <div className="text-right">Points</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <div key={user.id} className="p-4 hover:bg-gray-500 transition-colors flex justify-between">
                <div className="flex items-center">
                  <span className="mr-2">{getMedal(index + 1)}</span>
                  <span>{index + 1}</span>
                </div>
                <div>{user.name || "Anonymous"}</div>
                <div className="text-right">{user.total_points || 0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;