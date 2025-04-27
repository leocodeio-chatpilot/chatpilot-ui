import { ActionFunctionArgs, json } from "@remix-run/node";
import { queryApi } from "~/services/model.server";
import { userSession } from "~/services/sessions.server";
import { ActionResult, ActionResultError } from "~/types/action-result";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any>> {
  // Get user session
  const session = await userSession(request);
  const user = session.getUserSession();

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
    const formData = await request.formData();
    const queryApiKeyPayload = {
      queryText: formData.get("queryText") as string,
      apiKey: formData.get("apiKey") as string,
    };
    const QueryApiResponse = await queryApi(queryApiKeyPayload, request);

    if (!QueryApiResponse.ok) {
      const error = await QueryApiResponse.text();
      const result: ActionResultError<any> = {
        success: false,
        origin: "message",
        data: null,
        message: error,
      };
      return result;
    }

    const data = await QueryApiResponse.json();
    const result: ActionResult<any> = {
      success: true,
      origin: "message",
      data: data,
      message: "API created successfully",
    };
    return result;
  } catch (error) {
    console.error("Error creating API:", error);

    const result: ActionResultError<any> = {
      success: false,
      origin: "message",
      data: null,
      message: "Error creating API",
    };
    return result;
  }
}
