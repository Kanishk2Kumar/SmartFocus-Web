"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import supabase from "@/lib/client";

type SupabaseUser = {
  id: string;
  userid: string;
  email: string;
  name?: string;
  total_points?: number;
};

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const supabaseUser = session?.user;

      if (supabaseUser) {
        console.log("Fetching user from DB:", supabaseUser.id);
        const { data: userProfile, error } = await supabase
          .from("user")
          .select("*")
          .eq("userid", supabaseUser.id)
          .single();

        if (!error && userProfile) {
          setUser({
            id: userProfile.id,
            userid: userProfile.userid,
            email: userProfile.email,
            name: userProfile.name,
            total_points: userProfile.total_points,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    getSessionAndUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getSessionAndUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
