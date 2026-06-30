import { Request, Response } from "express";
import { ArrivalService } from "../services/arrival.service";

export const createArrival = async (
  req: Request,
  res: Response
) => {
  try {
    const { vehicleId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!vehicleId) {
      return res.status(400).json({
        message: "vehicleId is required",
      });
    }

    const result =
      await ArrivalService.createArrival({
        vehicleId,
        userId,
      });

    return res.status(201).json(result);
  } catch (error: any) {
    if (
      error.message?.includes(
        "already in the queue"
      )
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
};