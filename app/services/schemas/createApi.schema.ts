import { z } from "zod";

export const CreateApiKeyPayloadSchema = z.object({
  userId: z.string(),
  websiteUrl: z.string().url(),
  websiteName: z.string().min(1).max(20),
});
