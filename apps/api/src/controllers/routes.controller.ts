import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createRoute = async (
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

  const {
    tenantCode,
    name,
    origin,
    destination,
    estimatedDistance,
    estimatedDuration,
  } = req.body;

  let tenantId = user.tenantId;

  // Super Admin can create routes for any tenant
  if (user.role === "SUPER_ADMIN") {
    if (!tenantCode) {
      res.status(400).json({
        success: false,
        message: "tenantCode is required",
      });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        code: tenantCode,
      },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
      return;
    }

    tenantId = tenant.id;
  }

  if (!tenantId) {
    res.status(400).json({
      success: false,
      message: "Tenant not resolved",
    });
    return;
  }

  const existingRoute = await prisma.route.findFirst({
    where: {
      tenantId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingRoute) {
    res.status(409).json({
      success: false,
      message: "Route already exists",
    });
    return;
  }

  const route = await prisma.route.create({
    data: {
      tenantId,
      name,
      origin,
      destination,
      estimatedDistance,
      estimatedDuration,
    },
  });

  res.status(201).json({
    success: true,
    message: "Route created successfully",
    data: route,
  });
};

export const getRoutes = async (
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

  const { tenantCode } = req.query;

  // =========================
  // SUPER ADMIN
  // =========================
  if (user.role === "SUPER_ADMIN") {
    // Dashboard summary
    if (!tenantCode) {
      const tenants = await prisma.tenant.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          routes: {
            select: {
              id: true,
              isActive: true,
              stages: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      const data = tenants.map((tenant) => {
        const routeCount = tenant.routes.length;

        const activeRouteCount = tenant.routes.filter(
          (route) => route.isActive
        ).length;

        const inactiveRouteCount = tenant.routes.filter(
          (route) => !route.isActive
        ).length;

        const stageCount = tenant.routes.reduce(
          (total, route) => total + route.stages.length,
          0
        );

        return {
          tenantCode: tenant.code,
          tenantName: tenant.name,
          routeCount,
          activeRouteCount,
          inactiveRouteCount,
          stageCount,
        };
      });

      res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
      return;
    }

    // Specific tenant routes
    const tenant = await prisma.tenant.findUnique({
      where: {
        code: tenantCode as string,
      },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
      return;
    }

    const routes = await prisma.route.findMany({
      where: {
        tenantId: tenant.id,
      },
      include: {
        stages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes,
    });
    return;
  }

  // =========================
  // TENANT USERS
  // =========================

  if (!user.tenantId) {
    res.status(403).json({
        success: false,
        message: "User is not assigned to a tenant",
    });
    return;
    }
  const routes = await prisma.route.findMany({
    where: {
      tenantId: user.tenantId,
    },
    include: {
      stages: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    count: routes.length,
    data: routes,
  });
};

export const getRouteById = async (
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

  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Route id is required",
    });
    return;
    }

    if (!id || Array.isArray(id)) {
    res.status(400).json({
        success: false,
        message: "Invalid route id",
    });
    return;
    }       

  const route = await prisma.route.findUnique({
    where: {
      id,
    },
    include: {
      stages: {
        orderBy: {
          order: "asc",
        },
      },
      dispatches: true,
      tenant: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });

  if (!route) {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
    return;
  }

  if (
    user.role !== "SUPER_ADMIN" &&
    route.tenantId !== user.tenantId
  ) {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: route,
  });
};

export const updateRoute = async (
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

  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid route id",
    });
    return;
  }

  const route = await prisma.route.findUnique({
    where: { id },
  });

  if (!route) {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
    return;
  }

  // TENANT ACCESS CONTROL
  if (
    user.role !== "SUPER_ADMIN" &&
    route.tenantId !== user.tenantId
  ) {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
    return;
  }

  const { name, origin, destination, isActive } = req.body;

  const updatedRoute = await prisma.route.update({
    where: { id },
    data: {
      name: name ?? route.name,
      origin: origin ?? route.origin,
      destination: destination ?? route.destination,
      isActive: isActive ?? route.isActive,
    },
  });

  res.status(200).json({
    success: true,
    message: "Route updated successfully",
    data: updatedRoute,
  });
};

export const deactivateRoute = async (
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

  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid route id",
    });
    return;
  }

  const route = await prisma.route.findUnique({
    where: { id },
  });

  if (!route) {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
    return;
  }

  // TENANT ACCESS CONTROL
  if (
    user.role !== "SUPER_ADMIN" &&
    route.tenantId !== user.tenantId
  ) {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
    return;
  }

  const updatedRoute = await prisma.route.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  res.status(200).json({
    success: true,
    message: "Route deactivated successfully",
    data: updatedRoute,
  });
};