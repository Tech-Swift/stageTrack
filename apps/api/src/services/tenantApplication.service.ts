import { prisma } from "../lib/prisma";
import { generateReferenceNumber } from "../utils/reference-generator";
import { CreateTenantApplicationDTO } from "../validators/tenantApplication.validator";

export const submitTenantApplication = async (
  data: CreateTenantApplicationDTO
) => {
  // Normalize incoming data
  const saccoName = data.saccoName.trim();
  const registrationNumber = data.registrationNumber?.trim();
  const preferredCode = data.preferredCode
    ?.trim()
    .toUpperCase();

  const county = data.county.trim();
  const town = data.town?.trim();
  const physicalAddress = data.physicalAddress?.trim();

  const contactName = data.contactName.trim();
  const contactEmail = data.contactEmail.trim().toLowerCase();
  const contactPhone = data.contactPhone.trim();
  const contactPosition = data.contactPosition?.trim();

  return prisma.$transaction(async (tx) => {
    // 1. Check for an existing active application
    // for the same SACCO
    const existingSaccoApplication =
      await tx.tenantApplication.findFirst({
        where: {
          saccoName,
          status: {
            in: ["PENDING", "UNDER_REVIEW"],
          },
        },
      });

    if (existingSaccoApplication) {
      throw new Error(
        "An active application already exists for this SACCO."
      );
    }

    // 2. Check for an existing active application
    // using the same contact email
    const existingEmailApplication =
      await tx.tenantApplication.findFirst({
        where: {
          contactEmail,
          status: {
            in: ["PENDING", "UNDER_REVIEW"],
          },
        },
      });

    if (existingEmailApplication) {
      throw new Error(
        "An active tenant application already exists for this contact email."
      );
    }

    // 3. Check for an existing active application
    // using the same contact phone
    const existingPhoneApplication =
      await tx.tenantApplication.findFirst({
        where: {
          contactPhone,
          status: {
            in: ["PENDING", "UNDER_REVIEW"],
          },
        },
      });

    if (existingPhoneApplication) {
      throw new Error(
        "An active tenant application already exists for this contact phone."
      );
    }

    // 4. Check whether the preferred tenant code
    // is already under review
    if (preferredCode) {
      const existingCodeApplication =
        await tx.tenantApplication.findFirst({
          where: {
            preferredCode,
            status: {
              in: ["PENDING", "UNDER_REVIEW"],
            },
          },
        });

      if (existingCodeApplication) {
        throw new Error(
          "The preferred tenant code is already under review."
        );
      }

      // 5. Check whether the preferred tenant code
      // already belongs to an existing tenant
      const existingTenant = await tx.tenant.findUnique({
        where: {
          code: preferredCode,
        },
      });

      if (existingTenant) {
        throw new Error(
          "The preferred tenant code is already in use."
        );
      }
    }

    // 6. Generate a unique application reference
    let referenceNumber: string;

    while (true) {
      referenceNumber = generateReferenceNumber("TAP");

      const existingReference =
        await tx.tenantApplication.findUnique({
          where: {
            referenceNumber,
          },
        });

      if (!existingReference) {
        break;
      }
    }

    // 7. Create the tenant application
    const application =
      await tx.tenantApplication.create({
        data: {
          saccoName,
          registrationNumber,
          preferredCode,

          county,
          town,
          physicalAddress,

          contactName,
          contactEmail,
          contactPhone,
          contactPosition,

          referenceNumber,
        },
      });

    return application;
  });
};
export const getTenantApplications = async () => {
  return prisma.tenantApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTenantApplicationById = async (
  id: string
) => {
  const application =
    await prisma.tenantApplication.findUnique({
      where: {
        id,
      },
    });

  if (!application) {
    throw new Error(
      "Tenant application not found."
    );
  }

  return application;
};

export const startTenantApplicationReview = async (
  applicationId: string,
  reviewerId: string
) => {
  return prisma.$transaction(async (tx) => {
    const application =
      await tx.tenantApplication.findUnique({
        where: {
          id: applicationId,
        },
      });

    if (!application) {
      throw new Error(
        "Tenant application not found."
      );
    }

    const reviewer = await tx.user.findUnique({
      where: {
        id: reviewerId,
      },
      select: {
        id: true,
      },
    });

    if (!reviewer) {
      throw new Error(
        "Reviewer not found."
      );
    }

    const updatedApplication =
      await tx.tenantApplication.updateMany({
        where: {
          id: applicationId,
          status: "PENDING",
        },
        data: {
          status: "UNDER_REVIEW",
          reviewedById: reviewerId,
          reviewedAt: new Date(),
        },
      });

    if (updatedApplication.count === 0) {
      throw new Error(
        `Tenant application cannot be reviewed because its current status is ${application.status}.`
      );
    }

    return tx.tenantApplication.findUnique({
      where: {
        id: applicationId,
      },
    });
  });
};

export const approveTenantApplication = async (
  applicationId: string,
  reviewerId: string,
  reviewNotes?: string
) => {
  return prisma.$transaction(async (tx) => {
    // 1. Find the application
    const application =
      await tx.tenantApplication.findUnique({
        where: {
          id: applicationId,
        },
      });

    if (!application) {
      throw new Error(
        "Tenant application not found."
      );
    }

    // 2. Application must currently be under review
    if (application.status !== "UNDER_REVIEW") {
      throw new Error(
        `Tenant application cannot be approved because its current status is ${application.status}.`
      );
    }

    // 3. Verify the reviewer exists
    const reviewer = await tx.user.findUnique({
      where: {
        id: reviewerId,
      },
      select: {
        id: true,
      },
    });

    if (!reviewer) {
      throw new Error(
        "Reviewer not found."
      );
    }

    // 4. A tenant must have a code
    const tenantCode =
      application.preferredCode
        ?.trim()
        .toUpperCase();

    if (!tenantCode) {
      throw new Error(
        "A tenant code is required before this application can be approved."
      );
    }

    // 5. Make sure the tenant code is not already in use
    const existingTenant =
      await tx.tenant.findUnique({
        where: {
          code: tenantCode,
        },
        select: {
          id: true,
        },
      });

    if (existingTenant) {
      throw new Error(
        "The tenant code is already in use."
      );
    }

    // 6. Create the tenant
    const tenant = await tx.tenant.create({
      data: {
        name: application.saccoName,
        code: tenantCode,
        email: application.contactEmail,
        phone: application.contactPhone,
        isActive: true,
      },
    });

    // 7. Mark the application as approved
    const approvedApplication =
      await tx.tenantApplication.update({
        where: {
          id: applicationId,
        },
        data: {
          status: "APPROVED",
          approvedTenantId: tenant.id,
          reviewedById: reviewerId,
          reviewedAt: new Date(),
          reviewNotes:
            reviewNotes?.trim() || null,
        },
      });

    // 8. Return both sides of the approval
    return {
      application: approvedApplication,
      tenant,
    };
  });
};

export const rejectTenantApplication = async (
  applicationId: string,
  reviewerId: string,
  rejectionReason: string,
  reviewNotes?: string
) => {
  return prisma.$transaction(async (tx) => {
    // 1. Find the application
    const application =
      await tx.tenantApplication.findUnique({
        where: {
          id: applicationId,
        },
      });

    if (!application) {
      throw new Error(
        "Tenant application not found."
      );
    }

    // 2. Application must currently be under review
    if (application.status !== "UNDER_REVIEW") {
      throw new Error(
        `Tenant application cannot be rejected because its current status is ${application.status}.`
      );
    }

    // 3. Verify the reviewer exists
    const reviewer = await tx.user.findUnique({
      where: {
        id: reviewerId,
      },
      select: {
        id: true,
      },
    });

    if (!reviewer) {
      throw new Error(
        "Reviewer not found."
      );
    }

    // 4. Normalize rejection information
    const normalizedRejectionReason =
      rejectionReason.trim();

    const normalizedReviewNotes =
      reviewNotes?.trim() || null;

    // 5. Reject the application
    const rejectedApplication =
      await tx.tenantApplication.updateMany({
        where: {
          id: applicationId,
          status: "UNDER_REVIEW",
        },
        data: {
          status: "REJECTED",
          reviewedById: reviewerId,
          reviewedAt: new Date(),
          rejectionReason:
            normalizedRejectionReason,
          reviewNotes:
            normalizedReviewNotes,
        },
      });

    // 6. Protect against concurrent state changes
    if (rejectedApplication.count === 0) {
      throw new Error(
        `Tenant application cannot be rejected because its current status is ${application.status}.`
      );
    }

    // 7. Return the updated application
    return tx.tenantApplication.findUnique({
      where: {
        id: applicationId,
      },
    });
  });
};