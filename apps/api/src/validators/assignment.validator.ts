import { z } from "zod";

export const assignMarshalSchema = z
  .object({
    userId: z.string().cuid(),
    stageId: z.string().cuid(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => !data.endDate || data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );