import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { ensureUserProfile } from "@/lib/ensureUserProfile";

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
  signInWithDemo: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
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
  const [userUuid, setUserUuid] = useState<string | null>(null);
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
          setUserUuid(supabaseUser.id);
          setLoading(false);
          return;
        }

        // Get initial session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Ensure user profile exists and get UUID
          const uuid = await ensureUserProfile(session.user);
          setUserUuid(uuid);
        } else {
          setUserUuid(null);
        }
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        setUser(null);
        setUserUuid(null);
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes from Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("mock_auth_user");
        setUser(null);
        setUserUuid(null);
        setLoading(false);
        return;
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        const uuid = await ensureUserProfile(session.user);
        setUserUuid(uuid);
      } else {
        setUserUuid(null);
      }
      setLoading(false);
    });

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
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null,
        },
      },
    });
    
    // If sign-up was successful, create user profile and sign in immediately
    if (data.user && !error) {
      console.log("🎯 Creating user profile after sign-up");
      const uuid = await ensureUserProfile(data.user);
      
      // Automatically sign in the user (bypass email confirmation)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error("❌ Auto sign-in failed:", signInError);
        return { error: signInError };
      }
      
      console.log("✅ User signed up and signed in successfully");
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log("🔄 Starting sign out process...");
    
    try {
      // Debug Supabase client
      console.log("🔧 Supabase client info:", {
        hasAuth: !!supabase.auth,
        hasClient: !!supabase
      });
      
      // Clear demo account if it exists
      console.log("🗑️ Clearing mock auth user from localStorage...");
      localStorage.removeItem("mock_auth_user");
      
      // Skip problematic Supabase calls and focus on local state cleanup
      console.log("🚀 Proceeding with local sign out (skipping Supabase calls)...");
      
      // Try to sign out from Supabase in background (non-blocking)
      console.log("🔄 Attempting background Supabase sign out...");
      supabase.auth.signOut().then(() => {
        console.log("✅ Background Supabase sign out completed");
      }).catch((error) => {
        console.warn("⚠️ Background Supabase sign out failed:", error);
      });
      
      // Update local state
      console.log("🔄 Updating local state...");
      setUser(null);
      setUserUuid(null);
      
      console.log("🚀 Redirecting to home page...");
      // Redirect to home page after sign out
      window.location.href = "/";
      
    } catch (error) {
      console.error("❌ Sign out process failed:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    console.log("🔄 Initiating Google OAuth...");
    console.log("📍 Current origin:", window.location.origin);
    console.log("🎯 Redirect URL:", `${window.location.origin}/auth/callback`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log("📡 OAuth response:", { data, error });

    // If we get a URL, do a full page redirect
    if (data?.url) {
      console.log("🚀 Redirecting to:", data.url);
      window.location.href = data.url;
    } else {
      console.log("⚠️ No redirect URL received");
    }

    return { error };
  };

  const signInWithDemo = async () => {
    const mockUser = {
      id: "f589c496-0283-44e6-8db5-aad1778f8f32",
      email: "demo@example.com",
      name: "Demo User",
      picture: "https://randomuser.me/api/portraits/men/1.jpg",
      provider: "demo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("mock_auth_user", JSON.stringify(mockUser));
    window.dispatchEvent(new Event("storage")); // trigger auth update
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const value: AuthContextType & { userUuid: string | null } = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithDemo,
    signInWithMagicLink,
    userUuid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
