import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, code, email, phone } = req.body;

    const existingTenant = await prisma.tenant.findUnique({
      where: {
        code,
      },
    });

    if (existingTenant) {
      res.status(400).json({
        success: false,
        message: "Tenant code already exists",
      });
      return;
    }

    const tenant = await prisma.tenant.create({
      data: {
        name,
        code,
        email,
        phone,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: tenant,
    });
  } catch (error) {
    console.error("Create tenant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create tenant",
    });
  }
};

export const getTenants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [count, tenants] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      count,
      data: tenants,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tenants",
    });
  }
};

export const getTenantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const tenant = await prisma.tenant.findUnique({
      where: {
        id,
      },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant",
    });
  }
};

export const getTenantByCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const code = String(req.params.code);

    const tenant = await prisma.tenant.findUnique({
      where: {
        code,
      },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant",
    });
  }
};

export const updateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const tenant = await prisma.tenant.findUnique({
      where: {
        id,
      },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
      return;
    }

    const updatedTenant = await prisma.tenant.update({
      where: {
        id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
    });

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data: updatedTenant,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update tenant",
    });
  }
};

export const deactivateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const tenant = await prisma.tenant.findUnique({
      where: {
        id,
      },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
      return;
    }

    const updatedTenant = await prisma.tenant.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    res.status(200).json({
      success: true,
      message: "Tenant deactivated successfully",
      data: updatedTenant,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate tenant",
    });
  }
};