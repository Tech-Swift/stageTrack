import { Request, Response } from "express";

import {
  submitTenantApplication,
} from "../services/tenantApplication.service";

export const submitTenantApplicationController = async (
  req: Request,
  res: Response
) => {
  try {
    const application = await submitTenantApplication(req.body);

    return res.status(201).json({
      success: true,
      message: "Tenant application submitted successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Submit tenant application error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit tenant application.",
    });
  }
};