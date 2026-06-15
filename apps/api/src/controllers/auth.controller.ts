import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { userActivationService } from "../services/userActivation.service";

export const setPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
      try {
        const { token, password, confirmPassword } = req.body;
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Token is required",
            });
            return;
        }

        if (!password || password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
            return;
        }
        
        const setUpToken = await prisma.passwordSetupToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!setUpToken) {
            res.status(404).json({
                success: false,
                message: "Invalid setup token",
            });
            return;
        }

        if (setUpToken.used) {
            res.status(400).json({
                success: false,
                message: "Token already used",
            });
            return;
        }

        if (setUpToken.expiresAt < new Date()) {
            res.status(400).json({
                success: false,
                message: "Token expired",
            });
            return;
        }

        const user = setUpToken.user;

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                accountStatus: "ACTIVE",
            },
        });
        await prisma.passwordSetupToken.update({
            where: { id: setUpToken.id },
            data: { used: true },
        });

        await userActivationService.activateRoleEntities(updatedUser);

        res.status(200).json({
            success: true,
            message: "Password set successfully. You can now login.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to set password",
        });
    }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    if (!user.password) {
      res.status(401).json({
        success: false,
        message: "Password not set",
      });
      return;
    }

    if (user.accountStatus !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message: "Account not active",
      });
      return;
    }

    if (
        user.lockedUntil &&
        user.lockedUntil > new Date()
        ) {
        res.status(403).json({
            success: false,
            message:
            "Account temporarily locked",
        });

        return;
        }
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword) {

        const attempts =
            user.failedLoginAttempts + 1;

        await prisma.user.update({
            where: {
            id: user.id,
            },
            data: {
            failedLoginAttempts: attempts,

            lockedUntil:
                attempts >= 5
                ? new Date(
                    Date.now() + 15 * 60 * 1000
                    )
                : null,
            },
        });

        res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });

        return;
        }
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            lastLoginAt: new Date(),

            failedLoginAttempts: 0,

            lockedUntil: null,
        },
        });    

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      tenantCode: user.tenant?.code || "",
      role: user.role,
    });
  
    res.status(200).json({
      success: true,
      message: "Login successful welcome to our Sacco",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantCode: user.tenant?.code,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const userId =
      req.user?.userId;

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        include: {
          tenant: true,
          profile: true,
        },
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId =
      req.user?.userId;

    const {
      phone,
      profileImageUrl,
    } = req.body;

    const profile =
      await prisma.userProfile.update({
        where: {
          userId,
        },

        data: {
          phone,
          profileImageUrl,
        },
      });

    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId =
      req.user?.userId;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      newPassword !==
      confirmPassword
    ) {
      res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });

      return;
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (
      !user ||
      !user.password
    ) {
      res.status(404).json({
        success: false,
        message:
          "User not found",
      });

      return;
    }

    const valid =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!valid) {
      res.status(400).json({
        success: false,
        message:
          "Current password incorrect",
      });

      return;
    }

    const hashed =
      await bcrypt.hash(
        newPassword,
        10
      );

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hashed,
      },
    });

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to change password",
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const token = crypto
      .randomBytes(32)
      .toString("hex");

    await prisma.passwordResetToken.updateMany({
        where: {
            userId: user.id,
            used: false,
        },
        data: {
            used: true,
        },
    });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000
        ), // 1 hour
      },
    });

    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken: token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to generate reset token",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      token,
      password,
      confirmPassword,
    } = req.body;

    if (
      !token ||
      !password ||
      !confirmPassword
    ) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
      return;
    }

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          token,
        },
        include: {
          user: true,
        },
      });

    if (!resetToken) {
      res.status(404).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    if (resetToken.used) {
      res.status(400).json({
        success: false,
        message: "Token already used",
      });
      return;
    }

    if (
      resetToken.expiresAt <
      new Date()
    ) {
      res.status(400).json({
        success: false,
        message: "Token expired",
      });
      return;
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    await prisma.passwordResetToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        used: true,
      },
    });

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to reset password",
    });
  }
};