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