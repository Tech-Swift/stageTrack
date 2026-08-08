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

};

export const getTenantApplicationById = async (
  id: string
) => {

};

export const startTenantApplicationReview = async (
  applicationId: string,
  reviewerId: string
) => {

};

export const approveTenantApplication = async (
  applicationId: string,
  reviewerId: string
) => {

};

export const rejectTenantApplication = async (
  applicationId: string,
  reviewerId: string,
  rejectionReason: string,
  reviewNotes?: string
) => {

};