import { supabase } from "@/lib/supabase";

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
        .eq("userId", userId) // Using userId (camelCase) to match actual schema
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
        createdAt: new Date(item.createdAt), // Using camelCase
        updatedAt: new Date(item.updatedAt), // Using camelCase
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
      const { data: result, error } = await supabase
        .from("biomarkers")
        .insert([
          {
            user_id: userId,
            date: data.date,
            hemoglobin: data.hemoglobin,
            ferritin: data.ferritin,
            crp: data.crp,
            glucose: data.glucose,
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
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at),
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
      if (data.hemoglobin !== undefined)
        updateData.hemoglobin = data.hemoglobin;
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
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at),
      };
    } catch (error) {
      console.error("Error updating biomarker:", error);
      throw error;
    }
  }

  static async deleteBiomarker(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("biomarkers").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error deleting biomarker:", error);
      throw error;
    }
  }
}
