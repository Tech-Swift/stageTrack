import { Request, Response } from "express";
import {
  getTenantBranding,
  updateTenantBranding,
} from "../services/tenantBranding.service";

import {
  updateTenantBrandingSchema,
} from "../validators/tenantBranding.validator";

export const getBranding = async (
  req: Request,
  res: Response
) => {
  try {
    const tenantId = req.params.id as string;

    const user = req.user;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      user.role !== "SUPER_ADMIN" &&
      user.tenantId !== tenantId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this tenant branding.",
      });
    }

    const branding = await getTenantBranding(tenantId);

    if (!branding) {
      return res.status(404).json({
        success: false,
        message: "Tenant branding not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: branding,
    });
  } catch (error) {
    console.error("Get branding error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get tenant branding.",
    });
  }
};

export const updateBranding = async (
  req: Request,
  res: Response
) => {
  try {
    const tenantId = req.params.id as string;
    const user = req.user;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      user.role !== "SUPER_ADMIN" &&
      user.tenantId !== tenantId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this tenant branding.",
      });
    }

    const body =
      updateTenantBrandingSchema.parse(req.body);

    const branding =
      await updateTenantBranding(
        tenantId,
        body
      );

    return res.status(200).json({
      success: true,
      message:
        "Tenant branding updated successfully.",
      data: branding,
    });
  } catch (error) {
    console.error("Update branding error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update tenant branding.",
    });
  }
};