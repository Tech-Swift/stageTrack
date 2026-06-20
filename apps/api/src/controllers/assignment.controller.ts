import { Request, Response } from "express";
import { assignMarshalSchema } from "../validators/assignment.validator";
import { 
  createStageAssignment,
  getActiveMarshalsForStage,
  getMarshalAssignmentsService
} from "../services/assignment.service";
import { getAssignmentStatus } from "../utils/assignment";
import { getParam } from "../utils/http"

export const assignMarshalToStage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = assignMarshalSchema.parse(req.body);

    const tenantId =
      req.user?.tenantId;

    if (!tenantId) {
      res.status(400).json({
        success: false,
        message: "Tenant context missing",
      });
      return;
    }

    const assignment =
      await createStageAssignment({
        tenantId,
        userId: data.userId,
        stageId: data.stageId,
        startDate: data.startDate,
        endDate: data.endDate,
      });

    res.status(201).json({
      success: true,
      message: "Marshal assigned successfully",
      data: {
        ...assignment,
        status: getAssignmentStatus(assignment),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to assign marshal",
    });
  }
};

export const getActiveMarshals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      res.status(400).json({
        success: false,
        message: "Tenant context missing",
      });
      return;
    }

    const stageId = getParam(req, "stageId");

    if (!stageId) {
      res.status(400).json({
        success: false,
        message: "Invalid or missing stageId",
      });
      return;
    }
    const data = await getActiveMarshalsForStage(
      tenantId,
      stageId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getActiveMarshals error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active marshals",
    });
  }
};

export const getMarshalAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      res.status(400).json({
        success: false,
        message: "Tenant context missing",
      });
      return;
    }
    const userId = getParam(req, "userId");

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "Invalid or missing userId",
      });
      return;
    }
    const assignments =
      await getMarshalAssignmentsService(
        tenantId,
        userId
      );
    const data = assignments.map((a) => ({
      ...a,
      status: getAssignmentStatus(a),
    }));
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "getMarshalAssignments error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch marshal assignments",
    });
  }
};