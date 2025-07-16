import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log("🔄 Processing email confirmation...");
        
        // Get the token and type from URL parameters
        const token = searchParams.get("token");
        const type = searchParams.get("type");
        
        console.log("📧 Confirmation type:", type);
        console.log("🔑 Token present:", !!token);

        if (!token) {
          setStatus("error");
          setMessage("Invalid confirmation link. Please check your email and try again.");
          return;
        }

        if (type === "signup" || type === "email_change") {
          // Confirm the email
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          });

          if (error) {
            console.error("❌ Email confirmation error:", error);
            setStatus("error");
            setMessage(error.message || "Email confirmation failed. Please try again.");
          } else {
            console.log("✅ Email confirmed successfully");
            setStatus("success");
            setMessage("Email confirmed successfully! You can now sign in to your account.");
            
            // Redirect to sign in after 3 seconds
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 3000);
          }
        } else {
          setStatus("error");
          setMessage("Invalid confirmation type. Please check your email and try again.");
        }
      } catch (error) {
        console.error("❌ Error in email confirmation:", error);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
      }}
    >
      {status === "loading" && (
        <>
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
          <p style={{ color: "#6b7280" }}>Confirming your email...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="#16a34a"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 style={{ color: "#16a34a", marginBottom: "8px" }}>Email Confirmed!</h2>
          <p style={{ color: "#6b7280", textAlign: "center" }}>{message}</p>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Redirecting to sign in...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#fef2f2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="#dc2626"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 style={{ color: "#dc2626", marginBottom: "8px" }}>Confirmation Failed</h2>
          <p style={{ color: "#6b7280", textAlign: "center" }}>{message}</p>
          <button
            onClick={() => navigate("/", { replace: true })}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Go to Sign In
          </button>
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 