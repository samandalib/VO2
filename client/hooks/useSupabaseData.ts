import { useEffect, useState } from "react";
import {
  supabase,
  WeeklyMetrics,
  SessionMetrics,
  Biomarker,
  Protocol,
  UserProtocol,
} from "@/lib/supabase";
import { useAuth } from "@/contexts/SupabaseAuthContext";

// Hook for weekly metrics
export function useWeeklyMetrics() {
  const { user } = useAuth();
  const [data, setData] = useState<WeeklyMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: metrics, error } = await supabase
        .from("weekly_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (!error) {
        setData(metrics || []);
      }
      setLoading(false);
    };

    fetchData();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("weekly_metrics_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "weekly_metrics",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addWeeklyMetrics = async (
    metrics: Omit<
      WeeklyMetrics,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
  ) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("weekly_metrics").insert([
      {
        ...metrics,
        user_id: user.id,
      },
    ]);

    return { error };
  };

  return { data, loading, addWeeklyMetrics };
}

// Hook for session metrics
export function useSessionMetrics() {
  const { user } = useAuth();
  const [data, setData] = useState<SessionMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: metrics, error } = await supabase
        .from("session_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (!error) {
        setData(metrics || []);
      }
      setLoading(false);
    };

    fetchData();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("session_metrics_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_metrics",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addSessionMetrics = async (
    metrics: Omit<
      SessionMetrics,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
  ) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("session_metrics").insert([
      {
        ...metrics,
        user_id: user.id,
      },
    ]);

    return { error };
  };

  return { data, loading, addSessionMetrics };
}

// Hook for biomarkers
export function useBiomarkers() {
  const { user } = useAuth();
  const [data, setData] = useState<Biomarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: biomarkers, error } = await supabase
        .from("biomarkers")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (!error) {
        setData(biomarkers || []);
      }
      setLoading(false);
    };

    fetchData();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("biomarkers_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "biomarkers",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addBiomarkers = async (
    biomarkers: Omit<Biomarker, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("biomarkers").insert([
      {
        ...biomarkers,
        user_id: user.id,
      },
    ]);

    return { error };
  };

  return { data, loading, addBiomarkers };
}

// Hook for protocols
export function useProtocols() {
  const [data, setData] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: protocols, error } = await supabase
        .from("protocols")
        .select("*")
        .order("name");

      if (!error) {
        setData(protocols || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
}

// Hook for user protocols
export function useUserProtocols() {
  const { user } = useAuth();
  const [data, setData] = useState<UserProtocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: userProtocols, error } = await supabase
        .from("user_protocols")
        .select(
          `
          *,
          protocol:protocols(*)
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setData(userProtocols || []);
      }
      setLoading(false);
    };

    fetchData();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("user_protocols_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_protocols",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addUserProtocol = async (protocolId: string, startDate: string) => {
    if (!user) return { error: "Not authenticated" };

    // Deactivate current active protocols
    await supabase
      .from("user_protocols")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Add new protocol
    const { error } = await supabase.from("user_protocols").insert([
      {
        user_id: user.id,
        protocol_id: protocolId,
        start_date: startDate,
        is_active: true,
      },
    ]);

    return { error };
  };

  return { data, loading, addUserProtocol };
}
