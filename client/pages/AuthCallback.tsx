import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL hash (e.g., magic link expired)
    const hash = window.location.hash;
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const errorDescription = params.get('error_description') || 'Authentication failed. Please try again.';
      setError(decodeURIComponent(errorDescription));
      setTimeout(() => navigate("/"), 4000);
      return;
    }
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 Processing OAuth callback...");
        console.log("🔧 Current URL:", window.location.href);
        console.log("🔧 URL hash:", window.location.hash);
        console.log("🔧 Supabase client available:", !!supabase);
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OAuth callback timeout')), 10000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        let data, error;
        try {
          const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
          data = result.data;
          error = result.error;
          console.log("✅ Session check completed");
        } catch (timeoutError) {
          console.warn("⚠️ Session check timed out, proceeding with fallback...");
          // Try to get session without waiting
          try {
            const fallbackResult = await supabase.auth.getSession();
            data = fallbackResult.data;
            error = fallbackResult.error;
          } catch (fallbackError) {
            console.error("❌ Fallback session check also failed:", fallbackError);
            setError("Authentication timeout. Please try again.");
            setTimeout(() => navigate("/"), 3000);
            return;
          }
        }
        
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
