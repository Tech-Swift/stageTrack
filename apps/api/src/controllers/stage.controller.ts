import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getParam } from "../utils/http"
export const createStage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const { routeId, name, stageNumber } = req.body;

  let tenantId = user.tenantId;

    if (user.role === "SUPER_ADMIN") {
    const route = await prisma.route.findFirst({
        where: {
        id: routeId,
        },
    });

    if (!route) {
        res.status(404).json({
        success: false,
        message: "Route not found",
        });
        return;
    }

    tenantId = route.tenantId;
    }

    if (!tenantId) {
    res.status(400).json({
        success: false,
        message: "Tenant not resolved",
    });
    return;
    }

  const existingStage = await prisma.stage.findFirst({
    where: {
      routeId,
      stageNumber,
    },
  });

  if (existingStage) {
    res.status(409).json({
      success: false,
      message: "Stage number already exists for this route",
    });
    return;
  }

  const existingName = await prisma.stage.findFirst({
    where: {
      routeId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingName) {
    res.status(409).json({
      success: false,
      message: "Stage already exists on this route",
    });
    return;
  }

  const stage = await prisma.stage.create({
    data: {
      tenantId,
      routeId,
      name,
      stageNumber,
    },
  });

  res.status(201).json({
    success: true,
    message: "Stage created successfully",
    data: stage,
  });
};

export const getStages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const routeId = getParam(req, "routeId");

  if (!routeId) {
    res.status(400).json({
      success: false,
      message: "Invalid routeId",
    });
    return;
  }

  let tenantId = user.tenantId;

  if (user.role === "SUPER_ADMIN") {
    const route = await prisma.route.findFirst({
      where: { id: routeId },
    });

    if (!route) {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
      return;
    }

    tenantId = route.tenantId;
  }

  if (!tenantId) {
    res.status(400).json({
      success: false,
      message: "Tenant not resolved",
    });
    return;
  }

  const stages = await prisma.stage.findMany({
    where: {
      routeId,
      tenantId,
      isActive: true,
    },
    orderBy: {
      stageNumber: "asc",
    },
  });

  res.status(200).json({
    success: true,
    data: stages,
  });
};

export const getStageById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const stageId = getParam(req, "id");

  if (!stageId) {
    res.status(400).json({
      success: false,
      message: "Invalid stage id",
    });
    return;
  }

  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
    },
    include: {
      route: true,
    },
  });

  if (!stage) {
    res.status(404).json({
      success: false,
      message: "Stage not found",
    });
    return;
  }

  // 🔐 ENFORCE TENANT ACCESS HERE
  if (user.role !== "SUPER_ADMIN") {
    if (stage.tenantId !== user.tenantId) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }
  }

  res.status(200).json({
    success: true,
    data: stage,
  });
};