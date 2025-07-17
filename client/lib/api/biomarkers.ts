import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface BiomarkerEntry {
  id?: string;
  date: string;
  hemoglobin?: number;
  ferritin?: number;
  crp?: number;
  glucose?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BiomarkersService {
  static async getBiomarkers(userId: string): Promise<BiomarkerEntry[]> {
    try {
      const { data, error } = await supabase
        .from("biomarkers")
        .select("*")
        .eq("userId", userId) // Updated to match schema
        .order("date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => ({
        id: item.id,
        date: item.date,
        hemoglobin: item.hemoglobin,
        ferritin: item.ferritin,
        crp: item.crp,
        glucose: item.glucose,
        createdAt: new Date(item.createdAt), // Updated to match schema
        updatedAt: new Date(item.updatedAt), // Updated to match schema
      }));
    } catch (error) {
      console.error("Error fetching biomarkers:", error);
      throw error;
    }
  }

  static async createBiomarker(
    userId: string,
    data: Omit<BiomarkerEntry, "id" | "createdAt" | "updatedAt">,
  ): Promise<BiomarkerEntry> {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      const { data: result, error } = await supabase
        .from("biomarkers")
        .insert([
          {
            id: newId,
            userId: userId,
            date: data.date,
            hemoglobin: data.hemoglobin,
            ferritin: data.ferritin,
            crp: data.crp,
            glucose: data.glucose,
            createdAt: now,
            updatedAt: now,
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
        hemoglobin: result.hemoglobin,
        ferritin: result.ferritin,
        crp: result.crp,
        glucose: result.glucose,
        createdAt: new Date(result.createdAt), // Updated to match schema
        updatedAt: new Date(result.updatedAt), // Updated to match schema
      };
    } catch (error) {
      console.error("Error creating biomarker:", error);
      throw error;
    }
  }

  static async updateBiomarker(
    id: string,
    data: Partial<Omit<BiomarkerEntry, "id" | "createdAt" | "updatedAt">>,
  ): Promise<BiomarkerEntry> {
    try {
      const updateData: any = {};
      if (data.date !== undefined) updateData.date = data.date;
      if (data.hemoglobin !== undefined) updateData.hemoglobin = data.hemoglobin;
      if (data.ferritin !== undefined) updateData.ferritin = data.ferritin;
      if (data.crp !== undefined) updateData.crp = data.crp;
      if (data.glucose !== undefined) updateData.glucose = data.glucose;

      const { data: result, error } = await supabase
        .from("biomarkers")
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
        hemoglobin: result.hemoglobin,
        ferritin: result.ferritin,
        crp: result.crp,
        glucose: result.glucose,
        createdAt: new Date(result.createdAt), // Updated to match schema
        updatedAt: new Date(result.updatedAt), // Updated to match schema
      };
    } catch (error) {
      console.error("Error updating biomarker:", error);
      throw error;
    }
  }

  static async deleteBiomarker(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("biomarkers")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error deleting biomarker:", error);
      throw error;
    }
  }
}
