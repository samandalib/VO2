import { supabase } from "@/lib/supabase";

export interface SessionMetrics {
  id?: string;
  date: string;
  maxHR?: number;
  avgHR?: number;
  sessionType?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SessionMetricsService {
  static async getMetrics(userId: string): Promise<SessionMetrics[]> {
    try {
      const { data, error } = await supabase
        .from("session_metrics")
        .select("*")
        .eq("userId", userId) // Updated to match schema
        .order("date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => ({
        id: item.id,
        date: item.date,
        maxHR: item.maxHR, // Updated to match schema
        avgHR: item.avgHR, // Updated to match schema
        sessionType: item.sessionType, // Updated to match schema
        notes: item.notes,
        createdAt: new Date(item.createdAt), // Updated to match schema
        updatedAt: new Date(item.updatedAt), // Updated to match schema
      }));
    } catch (error) {
      console.error("Error fetching session metrics:", error);
      throw error;
    }
  }

  static async createMetric(
    userId: string,
    data: Omit<SessionMetrics, "id" | "createdAt" | "updatedAt">,
  ): Promise<SessionMetrics> {
    try {
      const { data: result, error } = await supabase
        .from("session_metrics")
        .insert([
          {
            userId: userId, // Updated to match schema
            date: data.date,
            maxHR: data.maxHR, // Updated to match schema
            avgHR: data.avgHR, // Updated to match schema
            sessionType: data.sessionType, // Updated to match schema
            notes: data.notes,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: result.id,
        date: result.date,
        maxHR: result.maxHR, // Updated to match schema
        avgHR: result.avgHR, // Updated to match schema
        sessionType: result.sessionType, // Updated to match schema
        notes: result.notes,
        createdAt: new Date(result.createdAt), // Updated to match schema
        updatedAt: new Date(result.updatedAt), // Updated to match schema
      };
    } catch (error) {
      console.error("Error creating session metric:", error);
      throw error;
    }
  }

  static async updateMetric(
    id: string,
    data: Partial<Omit<SessionMetrics, "id" | "createdAt" | "updatedAt">>,
  ): Promise<SessionMetrics> {
    try {
      const updateData: any = {};
      if (data.date !== undefined) updateData.date = data.date;
      if (data.maxHR !== undefined) updateData.maxHR = data.maxHR; // Updated to match schema
      if (data.avgHR !== undefined) updateData.avgHR = data.avgHR; // Updated to match schema
      if (data.sessionType !== undefined) updateData.sessionType = data.sessionType; // Updated to match schema
      if (data.notes !== undefined) updateData.notes = data.notes;

      const { data: result, error } = await supabase
        .from("session_metrics")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: result.id,
        date: result.date,
        maxHR: result.maxHR, // Updated to match schema
        avgHR: result.avgHR, // Updated to match schema
        sessionType: result.sessionType, // Updated to match schema
        notes: result.notes,
        createdAt: new Date(result.createdAt), // Updated to match schema
        updatedAt: new Date(result.updatedAt), // Updated to match schema
      };
    } catch (error) {
      console.error("Error updating session metric:", error);
      throw error;
    }
  }

  static async deleteMetric(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("session_metrics")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error deleting session metric:", error);
      throw error;
    }
  }
}
