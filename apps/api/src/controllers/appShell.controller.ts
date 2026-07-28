// src/controllers/appShell.controller.ts

import { Request, Response } from "express";

import { getAppShellData } from "../services/appShell.service";

export const getAppShell = async (
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

    const appShell = await getAppShellData(
      user.userId
    );

    return res.status(200).json({
      success: true,
      data: appShell,
    });
  } catch (error) {
    console.error("Get App Shell:", error);

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to load App Shell.",
    });
  }
};