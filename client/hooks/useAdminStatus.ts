import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAdminStatus(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("user_id", userId)
      .single()
      .then(({ data }) => setIsAdmin(!!data?.is_admin));
  }, [userId]);

  return isAdmin;
} 