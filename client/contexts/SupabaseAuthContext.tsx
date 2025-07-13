import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo account first
    const checkAuth = async () => {
      try {
        const mockUser = localStorage.getItem("mock_auth_user");
        if (mockUser) {
          console.log("Found mock user in localStorage:", mockUser);
          const parsedUser = JSON.parse(mockUser);
          // Create a mock User object compatible with Supabase
          const supabaseUser: User = {
            id: parsedUser.id,
            email: parsedUser.email,
            user_metadata: {
              name: parsedUser.name,
              picture: parsedUser.picture,
            },
            app_metadata: {},
            aud: "authenticated",
            created_at: parsedUser.createdAt,
            updated_at: parsedUser.updatedAt,
          } as User;
          console.log("Setting demo user:", supabaseUser);
          setUser(supabaseUser);
          setLoading(false);
          return;
        }

        // Get initial session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Error in auth check:", error);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();

    // Also listen for localStorage changes (for demo accounts)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mock_auth_user") {
        console.log("localStorage changed for mock_auth_user");
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check localStorage periodically in case storage events don't fire
    const intervalId = setInterval(() => {
      const mockUser = localStorage.getItem("mock_auth_user");
      if (mockUser && !user) {
        console.log("Periodic check found mock user, triggering auth check");
        checkAuth();
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      // Create user profile if it doesn't exist
      if (session?.user && event === "SIGNED_IN") {
        const { data: existingProfile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!existingProfile) {
          await supabase.from("user_profiles").insert([
            {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || null,
              picture: session.user.user_metadata?.picture || null,
            },
          ]);
        }
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    // Clear demo account if it exists
    localStorage.removeItem("mock_auth_user");
    // Sign out from Supabase
    await supabase.auth.signOut();
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
