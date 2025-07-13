import { useState, useEffect } from "react";
import {
  getUserProgress,
  getProgressStats,
  createMockProgressData,
} from "@/lib/user-progress";

interface User {
  email: string;
}

export function useDashboardData(user: User | null) {
  const [progressStats, setProgressStats] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);

      let progress = getUserProgress(user.email);

      // If no progress exists, create mock data for demonstration
      if (!progress) {
        createMockProgressData(user.email, 42); // Mock baseline of 42 ml/kg/min
        progress = getUserProgress(user.email);
      }

      setUserProgress(progress);
      setProgressStats(getProgressStats(user.email));
      setIsLoading(false);
    }
  }, [user]);

  return {
    progressStats,
    userProgress,
    isLoading,
  };
}
