import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface UserProtocol {
  id?: string;
  userId: string;
  protocolId: string;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserProtocolsService {
  // Set a protocol as the current protocol for a user
  static async setCurrentProtocol(userId: string, protocolId: string, startDate: string = new Date().toISOString()): Promise<UserProtocol> {
    // Deactivate previous protocols
    await supabase
      .from("user_protocols")
      .update({ isActive: false, endDate: new Date().toISOString() })
      .eq("userId", userId)
      .eq("isActive", true);

    // Insert new active protocol
    const newId = uuidv4();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("user_protocols")
      .insert([
        {
          id: newId,
          userId,
          protocolId,
          startDate,
          isActive: true,
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
      id: data.id,
      userId: data.userId,
      protocolId: data.protocolId,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  // Get the current active protocol for a user
  static async getCurrentProtocol(userId: string): Promise<UserProtocol | null> {
    const { data, error } = await supabase
      .from("user_protocols")
      .select("*")
      .eq("userId", userId)
      .eq("isActive", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No active protocol
      throw new Error(error.message);
    }
    return data;
  }
} 