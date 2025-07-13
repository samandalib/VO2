import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Testing...");

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("🔍 Testing Supabase connection...");
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        console.log("Supabase URL:", url);
        console.log("Supabase Key exists:", !!key);
        console.log("Key starts with eyJ:", key?.startsWith("eyJ"));

        // Check if we're still using placeholder values
        if (url === "https://your-project-id.supabase.co" || !url) {
          console.error(
            "🚨 CONFIGURATION ERROR: VITE_SUPABASE_URL is not set!",
          );
          console.error(
            "📋 Please go to https://supabase.com/dashboard �� Your Project → Settings → API",
          );
          console.error("📋 Copy the 'Project URL' and update your .env file");
          setConnectionStatus("❌ UPDATE .env: Need real SUPABASE_URL");
          return;
        }

        if (key === "your-anon-key-starting-with-eyJ" || !key) {
          console.error(
            "🚨 CONFIGURATION ERROR: VITE_SUPABASE_ANON_KEY is not set!",
          );
          console.error(
            "📋 Please go to https://supabase.com/dashboard → Your Project → Settings → API",
          );
          console.error(
            "📋 Copy the 'anon public' key and update your .env file",
          );
          setConnectionStatus("❌ UPDATE .env: Need real ANON_KEY");
          return;
        }

        // Test basic connection with a simple query to auth.users (always exists)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Supabase error:", error);
          console.error("❌ Error details:", JSON.stringify(error, null, 2));
          setConnectionStatus(
            `❌ Error: ${error.message || JSON.stringify(error)}`,
          );
        } else {
          console.log("✅ Supabase connected successfully!");
          console.log("✅ Session data:", data);
          setConnectionStatus("✅ Supabase connected successfully!");
        }
      } catch (error) {
        console.error("❌ Connection failed:", error);
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        setConnectionStatus(`❌ Connection failed: ${errorMessage}`);
      }
    };

    // Add a small delay to ensure environment variables are loaded
    setTimeout(testConnection, 1000);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "12px",
        zIndex: 1000,
        maxWidth: "300px",
        wordWrap: "break-word",
      }}
    >
      Supabase Status: {connectionStatus}
    </div>
  );
}
