import { ActionFunctionArgs, json } from "@remix-run/node";
import { createApiKey } from "~/services/model.server";
import { userSession } from "~/services/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const websiteUrl = formData.get("websiteUrl") as string;
  const websiteName = formData.get("websiteName") as string;

  // Get user session
  const session = await userSession(request);
  const user = session.getUserDetails();
  console.log("user", user);
  if (!user) {
    return json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
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
      return json(
        { success: false, message: error || "Failed to create API" },
        { status: createApiResponse.status }
      );
    }

    const data = await createApiResponse.json();
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
