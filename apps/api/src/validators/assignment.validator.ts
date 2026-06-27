import { z } from "zod";

export const assignMarshalSchema =
  z
    .object({
      userId: z.string().min(1),
      stageId: z.string().min(1),
      startDate: z.coerce.date(),
      endDate: z.coerce
        .date()
        .nullable()
        .optional(),

      shiftStart: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .nullable()
        .optional(),

      shiftEnd: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .nullable()
        .optional(),
    })
    .refine(
      (data) =>
        (!!data.shiftStart &&
          !!data.shiftEnd) ||
        (!data.shiftStart &&
          !data.shiftEnd),
      {
        message:
          "shiftStart and shiftEnd must both be provided",
        path: ["shiftStart"],
      }
    );