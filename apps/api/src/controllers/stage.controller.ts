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

export const getRouteStages = async (
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

  console.log("PARAMS:", req.params);

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

export const updateStage = async (
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

  // 🔥 FETCH STAGE FIRST
  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
    },
  });

  if (!stage) {
    res.status(404).json({
      success: false,
      message: "Stage not found",
    });
    return;
  }

  // 🔐 TENANT ACCESS CONTROL
  if (user.role !== "SUPER_ADMIN") {
    if (stage.tenantId !== user.tenantId) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }
  }

  const { name, stageNumber } = req.body;

  // 🔥 CHECK DUPLICATE stageNumber (if updating)
  if (stageNumber !== undefined) {
    const existing = await prisma.stage.findFirst({
      where: {
        routeId: stage.routeId,
        stageNumber,
        NOT: {
          id: stageId,
        },
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: "Stage number already exists",
      });
      return;
    }
  }

  // 🔥 CLEAN UPDATE DATA (avoid overwriting with undefined)
  const data: any = {};

  if (name !== undefined) data.name = name;
  if (stageNumber !== undefined) data.stageNumber = stageNumber;

  const updatedStage = await prisma.stage.update({
    where: {
      id: stageId,
    },
    data,
  });

  res.status(200).json({
    success: true,
    message: "Stage updated successfully",
    data: updatedStage,
  });
};

export const deactivateStage = async (
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

  // 🔥 Fetch stage first
  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
    },
  });

  if (!stage) {
    res.status(404).json({
      success: false,
      message: "Stage not found",
    });
    return;
  }

  // 🔐 Tenant access control
  if (user.role !== "SUPER_ADMIN") {
    if (stage.tenantId !== user.tenantId) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }
  }

  // 🔥 Soft delete (deactivate)
  await prisma.stage.update({
    where: {
      id: stageId,
    },
    data: {
      isActive: false,
    },
  });

  res.status(200).json({
    success: true,
    message: "Stage deactivated successfully",
  });
};