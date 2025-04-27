import { z } from "zod";

export const QueryApiKeyPayloadSchema = z.object({
  queryText: z.string().min(1),
  apiKey: z.string().min(1),
});
