import { Request, Response } from "express";
import { DispatchService } from "../services/dispatch.service";

export const createDispatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const result = await DispatchService.createDispatch(
      req.body,
      userId
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("createDispatch error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};