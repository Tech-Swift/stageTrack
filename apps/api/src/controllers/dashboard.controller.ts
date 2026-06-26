import { Request, Response } from "express";
import { getMarshalDashboardData } from "../services/dashboard.service";

export const getMarshalDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dashboard =
      await getMarshalDashboardData(userId);

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Get marshal dashboard:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};