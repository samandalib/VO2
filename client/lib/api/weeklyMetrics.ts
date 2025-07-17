import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface WeeklyMetrics {
  id?: string;
  date: string;
  restingHeartRate?: number;
  vo2max?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WeeklyMetricsService {
  static async getMetrics(userId: string): Promise<WeeklyMetrics[]> {
    try {
      const { data, error } = await supabase
        .from("weekly_metrics")
        .select("*")
        .eq("userId", userId) // Updated to match schema
        .order("date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => ({
        id: item.id,
        date: item.date,
        restingHeartRate: item.restingHeartRate, // Updated to match schema
        vo2max: item.vo2max,
        notes: item.notes,
        createdAt: new Date(item.createdAt), // Updated to match schema
        updatedAt: new Date(item.updatedAt), // Updated to match schema
      }));
    } catch (error) {
      console.error("Error fetching weekly metrics:", error);
      throw error;
    }
  }

  static async createMetric(
    userId: string,
    data: Omit<WeeklyMetrics, "id" | "createdAt" | "updatedAt">,
  ): Promise<WeeklyMetrics> {
    try {
      const newId = uuidv4();
      const { data: result, error } = await supabase
        .from("weekly_metrics")
        .insert([
          {
            id: newId,
            userId: userId, // Updated to match schema
            date: data.date,
            restingHeartRate: data.restingHeartRate, // Updated to match schema
            vo2max: data.vo2max,
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
        restingHeartRate: result.restingHeartRate, // Updated to match schema
        vo2max: result.vo2max,
        notes: result.notes,
        createdAt: new Date(result.createdAt), // Updated to match schema
        updatedAt: new Date(result.updatedAt), // Updated to match schema
      };
    } catch (error) {
      console.error("Error creating weekly metric:", error);
      throw error;
    }
  }

  static async updateMetric(
    id: string,
    data: Partial<Omit<WeeklyMetrics, "id" | "createdAt" | "updatedAt">>,
  ): Promise<WeeklyMetrics> {
    try {
      const updateData: any = {};
      if (data.date !== undefined) updateData.date = data.date;
      if (data.restingHeartRate !== undefined)
        updateData.restingHeartRate = data.restingHeartRate; // Updated to match schema
      if (data.vo2max !== undefined) updateData.vo2max = data.vo2max;
      if (data.notes !== undefined) updateData.notes = data.notes;

      const { data: result, error } = await supabase
        .from("weekly_metrics")
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
        restingHeartRate: result.restingHeartRate, // Updated to match schema
        vo2max: result.vo2max,
        notes: result.notes,
        createdAt: new Date(result.createdAt), // Updated to match schema
        updatedAt: new Date(result.updatedAt), // Updated to match schema
      };
    } catch (error) {
      console.error("Error updating weekly metric:", error);
      throw error;
    }
  }

  static async deleteMetric(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("weekly_metrics")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error deleting weekly metric:", error);
      throw error;
    }
  }
}
