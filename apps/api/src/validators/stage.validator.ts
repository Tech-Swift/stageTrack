import { z } from "zod";

export const createStageSchema = z.object({
  routeId: z.string().cuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  stageNumber: z.number().int().positive(),
});