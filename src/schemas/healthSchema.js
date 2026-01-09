import { z } from "zod";

export const ExtractionSchema = z.object({
  
  answers: z.object({
    age: z.coerce.number().nullish(),
    smoker: z.coerce.boolean().nullish(),
    exercise: z.enum(["rarely", "sometimes", "often"]).nullish(),
    diet: z.string().nullish(),
  }).default({}), 
  confidence: z.coerce.number().default(0),
  missing_fields: z.array(z.string()).default([])
});