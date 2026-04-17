import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["active", "done", "delayed", "blocked", "frozen"]),
  category: z.string().optional(),
  urgency_score: z.number().default(0),
  impact_score: z.number().default(0),
  effort_score: z.number().default(0),
  priority_score: z.number().default(0),
  avoidance_count: z.number().default(0),
  created_at: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;
