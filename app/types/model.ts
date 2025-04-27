import { CreateApiKeyPayloadSchema } from "@/services/schemas/createApi.schema";
import { QueryApiKeyPayloadSchema } from "@/services/schemas/queryApi.schema";
import { z } from "zod";

export type CreateApiKeyPayload = z.infer<typeof CreateApiKeyPayloadSchema>;
export type QueryApiKeyPayload = z.infer<typeof QueryApiKeyPayloadSchema>;
