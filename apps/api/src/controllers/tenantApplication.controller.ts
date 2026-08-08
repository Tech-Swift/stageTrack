import { Request, Response } from "express";

import {
  submitTenantApplication,
  getTenantApplications,
  getTenantApplicationById,
  startTenantApplicationReview,
  approveTenantApplication,
  rejectTenantApplication
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


export const getTenantApplicationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const applications = await getTenantApplications();

    return res.status(200).json({
      success: true,
      message: "Tenant applications retrieved successfully.",
      data: applications,
    });
  } catch (error) {
    console.error(
      "Get tenant applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve tenant applications.",
    });
  }
};

export const getTenantApplicationByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const application =
      await getTenantApplicationById(id);

    return res.status(200).json({
      success: true,
      message:
        "Tenant application retrieved successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Get tenant application by ID error:",
      error
    );

    if (
      error instanceof Error &&
      error.message === "Tenant application not found."
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve tenant application.",
    });
  }
};

export const startTenantApplicationReviewController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const reviewerId = req.user!.userId;

    const application =
      await startTenantApplicationReview(
        id,
        reviewerId
      );

    return res.status(200).json({
      success: true,
      message:
        "Tenant application review started successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Start tenant application review error:",
      error
    );

    if (error instanceof Error) {
      if (
        error.message ===
        "Tenant application not found."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "Reviewer not found."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes(
          "cannot be reviewed because its current status is"
        )
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to start tenant application review.",
    });
  }
};

export const approveTenantApplicationController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const reviewerId = req.user!.userId;

    const { reviewNotes } = req.body;

    const result =
      await approveTenantApplication(
        id,
        reviewerId,
        reviewNotes
      );

    return res.status(200).json({
      success: true,
      message:
        "Tenant application approved successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Approve tenant application error:",
      error
    );

    if (error instanceof Error) {
      if (
        error.message ===
        "Tenant application not found."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "Reviewer not found."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes(
          "cannot be approved because its current status is"
        )
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "A tenant code is required before this application can be approved."
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "The tenant code is already in use."
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve tenant application.",
    });
  }
};

export const rejectTenantApplicationController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const reviewerId = req.user!.userId;

    const {
      rejectionReason,
      reviewNotes,
    } = req.body;

    const application =
      await rejectTenantApplication(
        id,
        reviewerId,
        rejectionReason,
        reviewNotes
      );

    return res.status(200).json({
      success: true,
      message:
        "Tenant application rejected successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Reject tenant application error:",
      error
    );

    if (error instanceof Error) {
      if (
        error.message ===
        "Tenant application not found."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "Reviewer not found."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes(
          "cannot be rejected because its current status is"
        )
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject tenant application.",
    });
  }
};