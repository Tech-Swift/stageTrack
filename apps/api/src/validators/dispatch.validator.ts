import { z } from "zod";

export const createDispatchSchema = z.object({
  queueId: z.string().min(1),
  busFare: z.number().positive(),
  saccoFee: z.number().min(0).optional(),
  remarks: z.string().optional(),
});