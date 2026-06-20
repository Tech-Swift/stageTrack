import { Request, Response } from "express";
import { ArrivalService } from "../services/arrival.service";

export const createArrival = async (req: Request, res: Response) => {
  try {
    const { stageId, vehicleId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await ArrivalService.createArrival({
      stageId,
      vehicleId,
      userId,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};