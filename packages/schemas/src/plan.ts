import { z } from "zod";

export const BrutalThreeItemSchema = z.object({
  title: z.string(),
  why_selected: z.string(),
  first_step: z.string(),
  estimated_minutes: z.number(),
});

export const PlanSchema = z.object({
  plan_id: z.string(),
  brutal_three: z.array(BrutalThreeItemSchema).max(3),
  reasoning_summary: z.string(),
  estimated_total_minutes: z.number(),
});

export type BrutalThreeItem = z.infer<typeof BrutalThreeItemSchema>;
export type Plan = z.infer<typeof PlanSchema>;
