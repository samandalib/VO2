export interface WeeklyMetrics {
  id?: string;
  date: string;
  restingHeartRate?: number;
  vo2max?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const API_BASE_URL = "/api";

export class WeeklyMetricsService {
  static async getMetrics(userId: string): Promise<WeeklyMetrics[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/weekly/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/metrics/weekly`, {
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
      console.error("Error creating weekly metric:", error);
      throw error;
    }
  }

  static async updateMetric(
    id: string,
    data: Partial<Omit<WeeklyMetrics, "id" | "createdAt" | "updatedAt">>,
  ): Promise<WeeklyMetrics> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/weekly/${id}`, {
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
      console.error("Error updating weekly metric:", error);
      throw error;
    }
  }

  static async deleteMetric(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/weekly/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting weekly metric:", error);
      throw error;
    }
  }
}
