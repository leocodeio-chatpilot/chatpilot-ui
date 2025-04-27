import { CreateApiKeyPayload, QueryApiKeyPayload } from "~/types/model";

export const createApiKey = async (
  createApiKeyPayload: CreateApiKeyPayload
) => {
  // Make API call to create a new API key
  const response = await fetch(
    `${process.env.VITE_APP_USER_BACKEND_MODEL_URL}/add-api`,
    {
      method: "POST",
      body: JSON.stringify(createApiKeyPayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_APP_API_KEY!,
        Accept: "application/json",
      },
      credentials: "include",
      mode: "cors",
    }
  );

  return response;
};

export const queryApi = async (queryApiKeyPayload: QueryApiKeyPayload) => {
  // Make API call to create a new API key
  const response = await fetch(
    `${process.env.VITE_APP_USER_BACKEND_MODEL_URL}/query`,
    {
      method: "POST",
      body: JSON.stringify(queryApiKeyPayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_APP_API_KEY!,
        Accept: "application/json",
      },
      credentials: "include",
      mode: "cors",
    }
  );

  return response;
};
