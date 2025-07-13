import { Request, Response } from "express";
import { prisma } from "../../client/lib/prisma";

// Helper function to get user ID from request (now set by middleware)
function getUserIdFromRequest(req: Request): string | null {
  return req.user?.id || null;
}

// Weekly Metrics API endpoints
export async function getWeeklyMetrics(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const metrics = await prisma.weeklyMetrics.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const formattedMetrics = metrics.map((metric) => ({
      id: metric.id,
      date: metric.date.toISOString().split("T")[0],
      restingHeartRate: metric.restingHeartRate || undefined,
      vo2max: metric.vo2max || undefined,
      notes: metric.notes || undefined,
      createdAt: metric.createdAt,
      updatedAt: metric.updatedAt,
    }));

    res.json(formattedMetrics);
  } catch (error) {
    console.error("Error fetching weekly metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createWeeklyMetric(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date, restingHeartRate, vo2max, notes } = req.body;

    const metric = await prisma.weeklyMetrics.create({
      data: {
        userId,
        date: new Date(date),
        restingHeartRate,
        vo2max,
        notes,
      },
    });

    const formattedMetric = {
      id: metric.id,
      date: metric.date.toISOString().split("T")[0],
      restingHeartRate: metric.restingHeartRate || undefined,
      vo2max: metric.vo2max || undefined,
      notes: metric.notes || undefined,
      createdAt: metric.createdAt,
      updatedAt: metric.updatedAt,
    };

    res.status(201).json(formattedMetric);
  } catch (error) {
    console.error("Error creating weekly metric:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateWeeklyMetric(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { date, restingHeartRate, vo2max, notes } = req.body;

    // Verify the metric belongs to the user
    const existingMetric = await prisma.weeklyMetrics.findFirst({
      where: { id, userId },
    });

    if (!existingMetric) {
      return res.status(404).json({ error: "Metric not found" });
    }

    const metric = await prisma.weeklyMetrics.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(restingHeartRate !== undefined && { restingHeartRate }),
        ...(vo2max !== undefined && { vo2max }),
        ...(notes !== undefined && { notes }),
      },
    });

    const formattedMetric = {
      id: metric.id,
      date: metric.date.toISOString().split("T")[0],
      restingHeartRate: metric.restingHeartRate || undefined,
      vo2max: metric.vo2max || undefined,
      notes: metric.notes || undefined,
      createdAt: metric.createdAt,
      updatedAt: metric.updatedAt,
    };

    res.json(formattedMetric);
  } catch (error) {
    console.error("Error updating weekly metric:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteWeeklyMetric(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Verify the metric belongs to the user
    const existingMetric = await prisma.weeklyMetrics.findFirst({
      where: { id, userId },
    });

    if (!existingMetric) {
      return res.status(404).json({ error: "Metric not found" });
    }

    await prisma.weeklyMetrics.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting weekly metric:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Session Metrics API endpoints
export async function getSessionMetrics(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const metrics = await prisma.sessionMetrics.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const formattedMetrics = metrics.map((metric) => ({
      id: metric.id,
      date: metric.date.toISOString().split("T")[0],
      maxHR: metric.maxHR || undefined,
      avgHR: metric.avgHR || undefined,
      sessionType: metric.sessionType || undefined,
      notes: metric.notes || undefined,
      createdAt: metric.createdAt,
      updatedAt: metric.updatedAt,
    }));

    res.json(formattedMetrics);
  } catch (error) {
    console.error("Error fetching session metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createSessionMetric(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date, maxHR, avgHR, sessionType, notes } = req.body;

    const metric = await prisma.sessionMetrics.create({
      data: {
        userId,
        date: new Date(date),
        maxHR,
        avgHR,
        sessionType,
        notes,
      },
    });

    const formattedMetric = {
      id: metric.id,
      date: metric.date.toISOString().split("T")[0],
      maxHR: metric.maxHR || undefined,
      avgHR: metric.avgHR || undefined,
      sessionType: metric.sessionType || undefined,
      notes: metric.notes || undefined,
      createdAt: metric.createdAt,
      updatedAt: metric.updatedAt,
    };

    res.status(201).json(formattedMetric);
  } catch (error) {
    console.error("Error creating session metric:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateSessionMetric(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { date, maxHR, avgHR, sessionType, notes } = req.body;

    // Verify the metric belongs to the user
    const existingMetric = await prisma.sessionMetrics.findFirst({
      where: { id, userId },
    });

    if (!existingMetric) {
      return res.status(404).json({ error: "Metric not found" });
    }

    const metric = await prisma.sessionMetrics.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(maxHR !== undefined && { maxHR }),
        ...(avgHR !== undefined && { avgHR }),
        ...(sessionType !== undefined && { sessionType }),
        ...(notes !== undefined && { notes }),
      },
    });

    const formattedMetric = {
      id: metric.id,
      date: metric.date.toISOString().split("T")[0],
      maxHR: metric.maxHR || undefined,
      avgHR: metric.avgHR || undefined,
      sessionType: metric.sessionType || undefined,
      notes: metric.notes || undefined,
      createdAt: metric.createdAt,
      updatedAt: metric.updatedAt,
    };

    res.json(formattedMetric);
  } catch (error) {
    console.error("Error updating session metric:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteSessionMetric(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Verify the metric belongs to the user
    const existingMetric = await prisma.sessionMetrics.findFirst({
      where: { id, userId },
    });

    if (!existingMetric) {
      return res.status(404).json({ error: "Metric not found" });
    }

    await prisma.sessionMetrics.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting session metric:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Biomarkers API endpoints
export async function getBiomarkers(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const biomarkers = await prisma.biomarker.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const formattedBiomarkers = biomarkers.map((biomarker) => ({
      id: biomarker.id,
      date: biomarker.date.toISOString().split("T")[0],
      hemoglobin: biomarker.hemoglobin || undefined,
      ferritin: biomarker.ferritin || undefined,
      crp: biomarker.crp || undefined,
      glucose: biomarker.glucose || undefined,
      createdAt: biomarker.createdAt,
      updatedAt: biomarker.updatedAt,
    }));

    res.json(formattedBiomarkers);
  } catch (error) {
    console.error("Error fetching biomarkers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createBiomarker(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date, hemoglobin, ferritin, crp, glucose } = req.body;

    const biomarker = await prisma.biomarker.create({
      data: {
        userId,
        date: new Date(date),
        hemoglobin,
        ferritin,
        crp,
        glucose,
      },
    });

    const formattedBiomarker = {
      id: biomarker.id,
      date: biomarker.date.toISOString().split("T")[0],
      hemoglobin: biomarker.hemoglobin || undefined,
      ferritin: biomarker.ferritin || undefined,
      crp: biomarker.crp || undefined,
      glucose: biomarker.glucose || undefined,
      createdAt: biomarker.createdAt,
      updatedAt: biomarker.updatedAt,
    };

    res.status(201).json(formattedBiomarker);
  } catch (error) {
    console.error("Error creating biomarker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateBiomarker(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { date, hemoglobin, ferritin, crp, glucose } = req.body;

    // Verify the biomarker belongs to the user
    const existingBiomarker = await prisma.biomarker.findFirst({
      where: { id, userId },
    });

    if (!existingBiomarker) {
      return res.status(404).json({ error: "Biomarker not found" });
    }

    const biomarker = await prisma.biomarker.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(hemoglobin !== undefined && { hemoglobin }),
        ...(ferritin !== undefined && { ferritin }),
        ...(crp !== undefined && { crp }),
        ...(glucose !== undefined && { glucose }),
      },
    });

    const formattedBiomarker = {
      id: biomarker.id,
      date: biomarker.date.toISOString().split("T")[0],
      hemoglobin: biomarker.hemoglobin || undefined,
      ferritin: biomarker.ferritin || undefined,
      crp: biomarker.crp || undefined,
      glucose: biomarker.glucose || undefined,
      createdAt: biomarker.createdAt,
      updatedAt: biomarker.updatedAt,
    };

    res.json(formattedBiomarker);
  } catch (error) {
    console.error("Error updating biomarker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteBiomarker(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Verify the biomarker belongs to the user
    const existingBiomarker = await prisma.biomarker.findFirst({
      where: { id, userId },
    });

    if (!existingBiomarker) {
      return res.status(404).json({ error: "Biomarker not found" });
    }

    await prisma.biomarker.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting biomarker:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
