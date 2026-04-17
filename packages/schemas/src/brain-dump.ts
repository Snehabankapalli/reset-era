import { z } from "zod";

export const DumpRequestSchema = z.object({
  raw_input: z.string().min(1, "Cannot be empty"),
  input_mode: z.enum(["text", "voice"]).default("text"),
  energy_level: z.enum(["low", "medium", "high"]).optional(),
  available_minutes: z.number().min(5).max(480).optional(),
});

export type DumpRequest = z.infer<typeof DumpRequestSchema>;
