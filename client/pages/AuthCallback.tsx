import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 Processing OAuth callback...");
        
        // Get the session from the URL hash/fragment
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Error getting session:", error);
          setError("Authentication failed. Please try again.");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        if (data.session) {
          console.log("✅ Authentication successful, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("⚠️ No session found, redirecting to home");
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("❌ Error in auth callback:", err);
        setError("An unexpected error occurred. Please try again.");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ color: "#ef4444", fontSize: "24px" }}>⚠️</div>
        <p style={{ color: "#ef4444" }}>{error}</p>
        <p style={{ color: "#6b7280" }}>Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ color: "#6b7280" }}>Completing authentication...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
