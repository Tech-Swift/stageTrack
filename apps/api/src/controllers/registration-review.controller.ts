import crypto from "crypto";
import { Request,Response } from "express";
import { prisma } from "../lib/prisma";

export const getRegistrationRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const tenantCode = req.query.tenantCode
    ? String(req.query.tenantCode)
    : undefined;

    const status = req.query.status
      ? String(req.query.status)
      : undefined;

    const isSuperAdmin =
      req.user!.role === "SUPER_ADMIN";

    const whereClause: any = {};


    if (!isSuperAdmin) {
      whereClause.tenantId = req.user!.tenantId;
    } else if (tenantCode) {
      whereClause.tenant = {
        code: tenantCode,
      };
    }
    if (status) {
      whereClause.status = status;
    }

    const requests =
      await prisma.registrationRequest.findMany({
        where: whereClause,

        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

export const approveRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const isSuperAdmin =
      req.user!.role === "SUPER_ADMIN";
    const whereClause: any = {
      id,
    };

    if (!isSuperAdmin) {
      whereClause.tenantId = req.user!.tenantId;
    }

    const request =
      await prisma.registrationRequest.findFirst({
        where: whereClause,
        include: {
          tenant: true,
        },
      });

    if (!request) {
      res.status(404).json({
        success: false,
        message:
          "Request not found for specified tenant",
      });
      return;
    }

    if (request.status !== "PENDING") {
      res.status(400).json({
        success: false,
        message: "Request already processed",
      });
      return;
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: request.email,
        },
      });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {

      const user = await tx.user.upsert({
        where: { email: request.email },
        update: {},
        create: {
          tenantId: request.tenantId,
          name: `${request.firstName} ${request.lastName}`,
          email: request.email,
          role: request.role,
          accountStatus: "PENDING_SETUP",
        },
      });

      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: request.firstName,
          lastName: request.lastName,
          phone: request.phone,
          nationalId: request.nationalId,
          profileImageUrl: request.profileImageUrl,
          goodConductUrl: request.goodConductUrl,
          licenceUrl: request.licenceUrl,
          badgeUrl: request.badgeUrl,
          vehicleLogbookUrl: request.vehicleLogbookUrl,
        },
      });

      const token = crypto.randomBytes(32).toString("hex");

      await tx.passwordSetupToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      console.log("Deleting registration request with id:", id);
      console.log("PARAM ID:", req.params.id);
      await tx.registrationRequest.delete({
        where: { id: request.id },
      });

      return { user, token };
    });

    res.status(200).json({
      success: true,
      message: "Request approved",
      tenant: {
        code: request.tenant.code,
        name: request.tenant.name,
      },
      setupToken: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const tenantCode = String(req.query.tenantCode);

    const { reason } = req.body;

    const request =
      await prisma.registrationRequest.findFirst({
        where: {
          id,
          tenant: {
            code: tenantCode,
          },
        },
      });

    if (!request) {
      res.status(404).json({
        success: false,
        message:
          "Request not found for specified tenant",
      });
      return;
    }

    if (request.status !== "PENDING") {
      res.status(400).json({
        success: false,
        message: "Request already processed",
      });
      return;
    }

    await prisma.registrationRequest.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });

    res.status(200).json({
      success: true,
      message: "Request rejected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};