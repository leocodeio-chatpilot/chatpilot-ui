import { ActionFunctionArgs, json } from "@remix-run/node";
import { createApiKey } from "~/services/model.server";
import { userSession } from "~/services/sessions.server";
import { ActionResult, ActionResultError } from "~/types/action-result";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any>> {
  const formData = await request.formData();
  const websiteUrl = formData.get("websiteUrl") as string;
  const websiteName = formData.get("websiteName") as string;

  // Get user session
  const session = await userSession(request);
  const user = session.getUserDetails();
  console.log("user", user);
  if (!user) {
    const result: ActionResultError<any> = {
      success: false,
      origin: "message",
      data: null,
      message: "User not authenticated",
    };
    return result;
  }

  try {
    // Make API call to create a new API key
    const createApiKeyPayload = {
      userId: user.id,
      websiteUrl,
      websiteName,
      mode: "sample" as "sample" | "complete",
    };
    const createApiResponse = await createApiKey(createApiKeyPayload, request);
    if (!createApiResponse.ok) {
      const error = await createApiResponse.text();
      const result: ActionResultError<any> = {
        success: false,
        origin: "query",
        data: null,
        message: error,
      };
      return result;
    }

    const data = await createApiResponse.json();
    const result: ActionResult<any> = {
      success: true,
      origin: "query",
      data: data,
      message: "API created successfully",
    };
    return result;
  } catch (error) {
    console.error("Error creating API:", error);
    const result: ActionResultError<any> = {
      success: false,
      origin: "query",
      data: null,
      message: "Error creating API",
    };
    return result;
  }
}
