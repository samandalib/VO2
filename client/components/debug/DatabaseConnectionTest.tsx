import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export function DatabaseConnectionTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    setTestResult("Testing connection...");

    try {
      // Test 1: Basic connection
      console.log("🔧 Testing Supabase connection...");

      // Test 2: Try to read from user_profiles table
      const { data: profiles, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .limit(1);

      if (profileError) {
        setTestResult(`❌ Database Error: ${profileError.message}`);
        console.error("Database connection failed:", profileError);
        return;
      }

      // Test 3: Check authentication state
      const { data: authData, error: authError } =
        await supabase.auth.getSession();

      if (authError) {
        setTestResult(`❌ Auth Error: ${authError.message}`);
        return;
      }

      // Test 4: Try to insert a test user profile (will fail if RLS is blocking)
      const testUserId = "00000000-0000-0000-0000-000000000000";
      const { data: insertData, error: insertError } = await supabase
        .from("user_profiles")
        .insert({
          id: testUserId,
          email: "test@connection.test",
          name: "Connection Test",
        });

      // Clean up test data
      if (!insertError) {
        await supabase.from("user_profiles").delete().eq("id", testUserId);
      }

      const results = [
        `✅ Supabase URL: ${import.meta.env.VITE_SUPABASE_URL}`,
        `✅ Database Connection: Success`,
        `✅ User Profiles Table: ${profiles?.length || 0} records found`,
        `✅ Auth State: ${authData.session ? "Authenticated" : "Not authenticated"}`,
        insertError
          ? `⚠️ Insert Test: ${insertError.message} (might be RLS protection)`
          : `✅ Insert Test: Success`,
      ];

      setTestResult(results.join("\n"));
    } catch (error) {
      setTestResult(`❌ Connection Failed: ${error}`);
      console.error("Connection test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "white",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 9999,
        maxWidth: "400px",
      }}
    >
      <h3>Database Connection Test</h3>
      <button
        onClick={runConnectionTest}
        disabled={loading}
        style={{
          background: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "10px",
        }}
      >
        {loading ? "Testing..." : "Test Database Connection"}
      </button>

      {testResult && (
        <pre
          style={{
            fontSize: "12px",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            whiteSpace: "pre-wrap",
            marginTop: "10px",
          }}
        >
          {testResult}
        </pre>
      )}
    </div>
  );
}
