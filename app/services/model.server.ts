import { CreateApiKeyPayload, QueryApiKeyPayload } from "~/types/model";
import { userSession } from "./sessions.server";

export const createApiKey = async (
  createApiKeyPayload: CreateApiKeyPayload,
  request: Request
) => {
  console.log("create api key called", createApiKeyPayload);
  const session = await userSession(request);
  const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
  // Make API call to create a new API key
  const response = await fetch(
    `${process.env.VITE_APP_USER_BACKEND_MODEL_URL}/add-api`,
    {
      method: "POST",
      body: JSON.stringify(createApiKeyPayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.UM_API_KEY!,
        Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
      },
      credentials: "include",
      mode: "cors",
    }
  );
  console.log("create api key response", response);

  return response;
};

export const queryApi = async (
  queryApiKeyPayload: QueryApiKeyPayload,
  request: Request
) => {
  const session = await userSession(request);
  const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
  // Make API call to query the API key
  const response = await fetch(
    `${process.env.VITE_APP_USER_BACKEND_MODEL_URL}/query`,
    {
      method: "POST",
      body: JSON.stringify(queryApiKeyPayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.UM_API_KEY!,
        Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
      },
      credentials: "include",
      mode: "cors",
    }
  );

  return response;
};
