import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboard.service";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dashboard = await getDashboardData({
      userId: user.userId,
      tenantId: user.tenantId as string,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Get dashboard:", error);

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};