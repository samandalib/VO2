import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAdminStatus(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    setLoading(true);
    
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("is_admin")
          .eq("id", userId)
          .single();
        
        if (error) {
          console.warn("Admin status check failed:", error.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data?.is_admin);
        }
      } catch (error) {
        console.warn("Admin status check error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [userId]);

  return { isAdmin, loading };
} 