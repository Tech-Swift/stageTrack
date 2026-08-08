import { z } from "zod";

export const createTenantApplicationSchema = z.object({
  saccoName: z
    .string()
    .trim()
    .min(2, "SACCO name must be at least 2 characters long."),

  registrationNumber: z
    .string()
    .trim()
    .min(2, "Registration number must be at least 2 characters long.")
    .optional(),

  preferredCode: z
    .string()
    .trim()
    .min(2, "Preferred tenant code must be at least 2 characters long.")
    .max(20, "Preferred tenant code cannot exceed 20 characters.")
    .toUpperCase()
    .optional(),

  county: z
    .string()
    .trim()
    .min(2, "County is required."),

  town: z
    .string()
    .trim()
    .min(2, "Town must be at least 2 characters long.")
    .optional(),

  physicalAddress: z
    .string()
    .trim()
    .min(2, "Physical address must be at least 2 characters long.")
    .optional(),

  contactName: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters long."),

  contactEmail: z
    .string()
    .trim()
    .email("Please provide a valid contact email address.")
    .toLowerCase(),

  contactPhone: z
    .string()
    .trim()
    .min(7, "Please provide a valid contact phone number."),

  contactPosition: z
    .string()
    .trim()
    .min(2, "Contact position must be at least 2 characters long.")
    .optional(),
});

export type CreateTenantApplicationDTO = z.infer<
  typeof createTenantApplicationSchema
>;


export const approveTenantApplicationSchema = z.object({
  reviewNotes: z
    .string()
    .trim()
    .min(2, "Review notes must be at least 2 characters long.")
    .optional(),
});

export type ApproveTenantApplicationDTO = z.infer<
  typeof approveTenantApplicationSchema
>;


export const rejectTenantApplicationSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(2, "Rejection reason must be at least 2 characters long."),

  reviewNotes: z
    .string()
    .trim()
    .min(2, "Review notes must be at least 2 characters long.")
    .optional(),
});

export type RejectTenantApplicationDTO = z.infer<
  typeof rejectTenantApplicationSchema
>;