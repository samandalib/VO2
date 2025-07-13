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

const API_BASE_URL = "/api";

export class BiomarkersService {
  static async getBiomarkers(userId: string): Promise<BiomarkerEntry[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/metrics/biomarkers/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/metrics/biomarkers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ userId, ...data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/metrics/biomarkers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating biomarker:", error);
      throw error;
    }
  }

  static async deleteBiomarker(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/biomarkers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting biomarker:", error);
      throw error;
    }
  }
}
