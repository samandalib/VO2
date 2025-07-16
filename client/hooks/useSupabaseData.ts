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
        .eq("userId", user.id) // Updated to match schema
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
          filter: `userId=eq.${user.id}`, // Updated to match schema
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
      "id" | "userId" | "createdAt" | "updatedAt" // Updated to match schema
    >,
  ) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("weekly_metrics").insert([
      {
        ...metrics,
        userId: user.id, // Updated to match schema
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
        .eq("userId", user.id) // Updated to match schema
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
          filter: `userId=eq.${user.id}`, // Updated to match schema
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
      "id" | "userId" | "createdAt" | "updatedAt" // Updated to match schema
    >,
  ) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("session_metrics").insert([
      {
        ...metrics,
        userId: user.id, // Updated to match schema
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
        .eq("userId", user.id) // Updated to match schema
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
          filter: `userId=eq.${user.id}`, // Updated to match schema
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
    biomarkers: Omit<Biomarker, "id" | "userId" | "createdAt" | "updatedAt">, // Updated to match schema
  ) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("biomarkers").insert([
      {
        ...biomarkers,
        userId: user.id, // Updated to match schema
      },
    ]);

    return { error };
  };

  return { data, loading, addBiomarkers };
}

// Hook for protocols (read-only)
export function useProtocols() {
  const [data, setData] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: protocols, error } = await supabase
        .from("protocols")
        .select("*")
        .order("name", { ascending: true });

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
        .eq("userId", user.id) // Updated to match schema
        .order("createdAt", { ascending: false }); // Updated to match schema

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
          filter: `userId=eq.${user.id}`, // Updated to match schema
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
      .update({ isActive: false }) // Updated to match schema
      .eq("userId", user.id) // Updated to match schema
      .eq("isActive", true); // Updated to match schema

    // Add new protocol
    const { error } = await supabase.from("user_protocols").insert([
      {
        userId: user.id, // Updated to match schema
        protocolId: protocolId, // Updated to match schema
        startDate: startDate, // Updated to match schema
        isActive: true, // Updated to match schema
      },
    ]);

    return { error };
  };

  return { data, loading, addUserProtocol };
}
