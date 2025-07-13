import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function AuthDebug() {
  const { isAuthenticated, isLoading, error, signInWithGoogle } = useAuth();

  const handleClick = () => {
    console.log("Button clicked!");
    console.log("Auth state:", { isAuthenticated, isLoading, error });

    if (!isAuthenticated) {
      console.log("Starting Google sign in...");
      signInWithGoogle().catch(console.error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>Auth Debug</h3>
      <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
      <p>Loading: {isLoading ? "Yes" : "No"}</p>
      <p>Error: {error || "None"}</p>
      <Button onClick={handleClick}>Test Auth</Button>
    </div>
  );
}
