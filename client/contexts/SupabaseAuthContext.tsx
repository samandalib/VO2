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

// Helper function to ensure user profile exists in database
const ensureUserProfileExists = async (user: User) => {
  try {
    console.log("🔍 Checking if user profile exists for:", user.id);

    const { data: existingProfile, error: selectError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("❌ Error checking user profile:", selectError);
      return;
    }

    if (!existingProfile) {
      console.log("➕ Creating user profile for:", user.email);

      const { data: newProfile, error: insertError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: user.id,
            email: user.email,
            name:
              user.user_metadata?.name || user.user_metadata?.full_name || null,
            picture:
              user.user_metadata?.picture ||
              user.user_metadata?.avatar_url ||
              null,
          },
        ]);

      if (insertError) {
        console.error("❌ Error creating user profile:", insertError);
      } else {
        console.log("✅ User profile created successfully");
      }
    } else {
      console.log("✅ User profile already exists");
    }
  } catch (error) {
    console.error("❌ Error in ensureUserProfileExists:", error);
  }
};

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

        // If we have a session, ensure user profile exists
        if (session?.user) {
          console.log(
            "🎯 Found existing session, ensuring user profile exists:",
            session.user.id,
          );
          await ensureUserProfileExists(session.user);
        }

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
      console.log("🔔 Auth state changed:", {
        event,
        session: session?.user?.id,
      });
      setUser(session?.user ?? null);

      // Create user profile if it doesn't exist
      if (
        session?.user &&
        (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
      ) {
        await ensureUserProfileExists(session.user);
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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    // If we get a URL, do a full page redirect
    if (data?.url) {
      window.location.href = data.url;
    }

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
