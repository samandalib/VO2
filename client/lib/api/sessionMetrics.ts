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
        .eq("userId", userId) // Using userId (camelCase) to match actual schema
        .order("date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => ({
        id: item.id,
        date: item.date,
        maxHR: item.maxHR, // Using camelCase
        avgHR: item.avgHR, // Using camelCase
        sessionType: item.sessionType, // Using camelCase
        notes: item.notes,
        createdAt: new Date(item.createdAt), // Using camelCase
        updatedAt: new Date(item.updatedAt), // Using camelCase
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
            user_id: userId,
            date: data.date,
            max_hr: data.maxHR,
            avg_hr: data.avgHR,
            session_type: data.sessionType,
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
        maxHR: result.max_hr,
        avgHR: result.avg_hr,
        sessionType: result.session_type,
        notes: result.notes,
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at),
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
      if (data.maxHR !== undefined) updateData.max_hr = data.maxHR;
      if (data.avgHR !== undefined) updateData.avg_hr = data.avgHR;
      if (data.sessionType !== undefined)
        updateData.session_type = data.sessionType;
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
        maxHR: result.max_hr,
        avgHR: result.avg_hr,
        sessionType: result.session_type,
        notes: result.notes,
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at),
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
