import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * Get users
 * /list users (tenant-aware + role filter +tenantcode for super admin)
 */

export const getUsers = async (req: Request, res:Response) => {
    try {
        const isSuperAdmin = req.user!.role === "SUPER_ADMIN";

        const role = req.query.role as string | undefined;
        const tenantCode = req.query.tenantCode as string | undefined;

        const whereClause: any = {};

        if (!isSuperAdmin) {
            whereClause.tenantId = req.user!.tenantId;
        } else if (tenantCode) {
            const tenant = await prisma.tenant.findUnique({
                where: {code: tenantCode},
            });

            if(!tenant) {
                return res.status(404).json({
                    success: false,
                    message: "Tenant not found",
                });
            }

            whereClause.tenantId = tenant.id;
        }

        if(role) {
            whereClause.role = role;
        }

        const users = await prisma.user.findMany({
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

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};


//get single user
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const isSuperAdmin = req.user!.role === "SUPER_ADMIN";

    const whereClause: any = { id };

    if (!isSuperAdmin) {
      whereClause.tenantId = req.user!.tenantId;
    }

    const user = await prisma.user.findFirst({
      where: whereClause,
      include: {
        tenant: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

//update users status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    const isSuperAdmin = req.user!.role === "SUPER_ADMIN";

    const whereClause: any = { id };

    if (!isSuperAdmin) {
      whereClause.tenantId = req.user!.tenantId;
    }

    const user = await prisma.user.findFirst({
      where: whereClause,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        accountStatus: status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User status updated",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;

    const actorRole = req.user!.role;
    const isSuperAdmin =
      actorRole === "SUPER_ADMIN";

    const whereClause: any = {
      id,
    };

    if (!isSuperAdmin) {
      whereClause.tenantId =
        req.user!.tenantId;
    }

    const user = await prisma.user.findFirst({
      where: whereClause,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cannot modify SUPER_ADMIN accounts
    if (user.role === "SUPER_ADMIN") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot modify SUPER_ADMIN role",
      });
    }

    // Only SUPER_ADMIN can create/promote SACCO_ADMIN
    if (
      role === "SACCO_ADMIN" &&
      !isSuperAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only SUPER_ADMIN can assign SACCO_ADMIN role",
      });
    }

    // Nobody except SUPER_ADMIN can assign SUPER_ADMIN
    if (
      role === "SUPER_ADMIN" &&
      !isSuperAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only SUPER_ADMIN can assign SUPER_ADMIN role",
      });
    }

    // DIRECTOR restrictions
    if (actorRole === "DIRECTOR") {
      const allowedRoles = [
        "STAGE_MARSHAL",
        "VEHICLE_OWNER",
        "DRIVER",
        "CONDUCTOR",
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          message:
            "Directors can only assign operational roles",
        });
      }
    }

    // MANAGER cannot assign roles
    if (actorRole === "MANAGER") {
      return res.status(403).json({
        success: false,
        message:
          "Managers are not allowed to assign roles",
      });
    }

    const updated =
      await prisma.user.update({
        where: { id },
        data: { role },
      });

    return res.status(200).json({
      success: true,
      message:
        "User role updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user role",
    });
  }
};