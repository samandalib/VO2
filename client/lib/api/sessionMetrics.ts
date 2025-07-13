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

const API_BASE_URL = "/api";

export class SessionMetricsService {
  static async getMetrics(userId: string): Promise<SessionMetrics[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/metrics/session/${userId}`,
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
      console.error("Error fetching session metrics:", error);
      throw error;
    }
  }

  static async createMetric(
    userId: string,
    data: Omit<SessionMetrics, "id" | "createdAt" | "updatedAt">,
  ): Promise<SessionMetrics> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/session`, {
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
      console.error("Error creating session metric:", error);
      throw error;
    }
  }

  static async updateMetric(
    id: string,
    data: Partial<Omit<SessionMetrics, "id" | "createdAt" | "updatedAt">>,
  ): Promise<SessionMetrics> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/session/${id}`, {
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
      console.error("Error updating session metric:", error);
      throw error;
    }
  }

  static async deleteMetric(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/session/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting session metric:", error);
      throw error;
    }
  }
}
