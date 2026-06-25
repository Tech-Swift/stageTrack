import { z } from "zod";

export const updateTenantBrandingSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),

  logoUrl: z.string().url().optional(),

  faviconUrl: z.string().url().optional(),

  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),

  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),

  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),

  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),

  textColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional(),

  buttonRadius: z.number().min(0).max(50).optional(),
});

export type UpdateTenantBrandingDto =
  z.infer<typeof updateTenantBrandingSchema>;