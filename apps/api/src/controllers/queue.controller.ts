import { Request, Response } from "express";
import { QueueService } from "../services/queue.service";

export const getStageQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stageId = req.params.stageId as string;

    const queue = await QueueService.getStageQueue(stageId);

    res.status(200).json({
      success: true,
      count: queue.length,
      data: queue,
    });
  } catch (error) {
    console.error("getStageQueue error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch queue",
    });
  }
};

export const getNextVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stageId = req.params.stageId as string;

    const vehicle = await QueueService.getNextVehicle(stageId);

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "No vehicles in queue",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("getNextVehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch next vehicle",
    });
  }
};

export const getVehicleQueueStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicleId = req.params.vehicleId as string;

    const queue = await QueueService.getVehicleQueueStatus(vehicleId);

    if (!queue) {
      res.status(404).json({
        success: false,
        message: "Vehicle is not currently in any queue",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (error) {
    console.error("getVehicleQueueStatus error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle queue status",
    });
  }
};

export const markReady = async (req: Request, res: Response) => {
  try {
    const queueId = req.params.queueId as string;
    const userId = req.user!.userId;

    const result = await QueueService.markReady(queueId, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelDispatch = async (
  req: Request,
  res: Response
) => {
  try {
    const queueId = req.params.queueId as string;
    const userId = req.user!.userId;

    const result =
      await QueueService.cancelDispatch(
        queueId,
        userId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const returnToQueue = async (
  req: Request,
  res: Response
) => {
  try {
    const queueId = req.params.queueId as string;
    const userId = req.user!.userId;

    const result =
      await QueueService.returnToQueue(
        queueId,
        userId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};