import { ActionFunctionArgs, json } from "@remix-run/node";
import { queryApi } from "~/services/model.server";
import { userSession } from "~/services/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const websiteUrl = formData.get("websiteUrl") as string;
  const websiteName = formData.get("websiteName") as string;

  // Get user session
  const session = await userSession(request);
  const user = session.getUserSession();

  if (!user) {
    return json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
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
      return json(
        { success: false, message: error || "Failed to create API" },
        { status: QueryApiResponse.status }
      );
    }

    const data = await QueryApiResponse.json();
    return json(
      { success: true, message: "API created successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating API:", error);
    return json(
      { success: false, message: "An error occurred while creating your API" },
      { status: 500 }
    );
  }
}
