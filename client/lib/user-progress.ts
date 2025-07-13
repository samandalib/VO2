interface UserProgress {
  userId: string;
  baselineVO2Max: number;
  currentVO2Max: number;
  startDate: string;
  measurements: VO2MaxMeasurement[];
  activeProtocol?: string;
}

interface VO2MaxMeasurement {
  date: string;
  vo2max: number;
  sessionType?: string;
  notes?: string;
}

const STORAGE_KEY = "userProgress";

export function getUserProgress(userId: string): UserProgress | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress = JSON.parse(stored);
      return allProgress[userId] || null;
    }
    return null;
  } catch {
    return null;
  }
}

export function setUserProgress(userId: string, progress: UserProgress): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    allProgress[userId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Failed to save user progress:", error);
  }
}

export function initializeUserProgress(
  userId: string,
  baselineVO2Max: number,
  protocol?: string,
): UserProgress {
  const startDate = new Date().toISOString();
  const progress: UserProgress = {
    userId,
    baselineVO2Max,
    currentVO2Max: baselineVO2Max,
    startDate,
    measurements: [
      {
        date: startDate,
        vo2max: baselineVO2Max,
        sessionType: "baseline",
        notes: "Initial assessment",
      },
    ],
    activeProtocol: protocol,
  };

  setUserProgress(userId, progress);
  return progress;
}

export function addVO2MaxMeasurement(
  userId: string,
  measurement: Omit<VO2MaxMeasurement, "date">,
): void {
  const progress = getUserProgress(userId);
  if (progress) {
    const newMeasurement = {
      ...measurement,
      date: new Date().toISOString(),
    };

    progress.measurements.push(newMeasurement);
    progress.currentVO2Max = measurement.vo2max;
    setUserProgress(userId, progress);
  }
}

// Mock data for demonstration
export function createMockProgressData(
  userId: string,
  baselineVO2Max: number,
): void {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // 30 days ago

  const measurements: VO2MaxMeasurement[] = [
    {
      date: startDate.toISOString(),
      vo2max: baselineVO2Max,
      sessionType: "baseline",
      notes: "Initial assessment",
    },
  ];

  // Add some mock progress measurements over 30 days
  for (let i = 1; i <= 4; i++) {
    const measurementDate = new Date(startDate);
    measurementDate.setDate(measurementDate.getDate() + i * 7); // Weekly measurements

    const improvement = Math.random() * 2 + 0.5; // 0.5-2.5 improvement per week
    measurements.push({
      date: measurementDate.toISOString(),
      vo2max: baselineVO2Max + improvement * i,
      sessionType: "training",
      notes: `Week ${i} assessment`,
    });
  }

  const progress: UserProgress = {
    userId,
    baselineVO2Max,
    currentVO2Max: measurements[measurements.length - 1].vo2max,
    startDate: startDate.toISOString(),
    measurements,
    activeProtocol: "tabata",
  };

  setUserProgress(userId, progress);
}

export function getProgressStats(userId: string) {
  const progress = getUserProgress(userId);
  if (!progress) return null;

  const improvement = progress.currentVO2Max - progress.baselineVO2Max;
  const improvementPercentage = (improvement / progress.baselineVO2Max) * 100;
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(progress.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return {
    baselineVO2Max: progress.baselineVO2Max,
    currentVO2Max: progress.currentVO2Max,
    improvement,
    improvementPercentage,
    daysSinceStart,
    totalMeasurements: progress.measurements.length,
    activeProtocol: progress.activeProtocol,
  };
}
