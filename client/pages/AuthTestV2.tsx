import React, { useState } from "react";
import { SimpleAuthModalV2 } from "@/components/auth/SimpleAuthModalV2";
import { useAuthV2 } from "@/contexts/SupabaseAuthContextV2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthTestV2() {
  const { user, signOut, loading } = useAuthV2();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthSuccess = () => {
    console.log("✅ Authentication successful!");
    // You can add navigation logic here
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("✅ Sign out successful!");
    } catch (error) {
      console.error("❌ Sign out failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Authentication V2 Test
          </h1>
          <p className="text-muted-foreground">
            This is a test page for the new V2 authentication system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              Current authentication state and user information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm ${loading ? 'text-yellow-600' : user ? 'text-green-600' : 'text-red-600'}`}>
                {loading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>

            {user && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User ID:</span>
                  <span className="text-sm text-muted-foreground">{user.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm text-muted-foreground">
                    {user.user_metadata?.name || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Provider:</span>
                  <span className="text-sm text-muted-foreground">
                    {user.app_metadata?.provider || 'email'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Actions</CardTitle>
            <CardDescription>
              Test the authentication functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user ? (
              <div className="space-y-3">
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full"
                >
                  Open Authentication Modal
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Click to test the V2 authentication modal
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full"
                >
                  Sign Out
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Click to sign out and test the sign out functionality
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Development Notes</CardTitle>
            <CardDescription>
              Information about this V2 authentication system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Purpose:</strong> This is a duplicate of the current authentication system for safe experimentation.</p>
              <p><strong>Files:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>client/contexts/SupabaseAuthContextV2.tsx</code> - V2 auth context</li>
                <li><code>client/components/auth/SimpleAuthModalV2.tsx</code> - V2 auth modal</li>
                <li><code>client/pages/AuthTestV2.tsx</code> - This test page</li>
              </ul>
              <p><strong>Usage:</strong> Import <code>useAuthV2</code> and <code>SimpleAuthModalV2</code> instead of the original versions.</p>
              <p><strong>Safety:</strong> The original authentication system remains untouched and functional.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* V2 Authentication Modal */}
      <SimpleAuthModalV2
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Sign in to Test V2"
        description="Test the new V2 authentication system"
      />
    </div>
  );
} 