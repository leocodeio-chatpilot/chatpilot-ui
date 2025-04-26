import { useState } from "react";
import { motion } from "framer-motion";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Home, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { userSession } from "~/services/sessions.server";
import { ModeToggle } from "~/components/mode-toggle";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import { Label } from "~/components/ui/label";

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
    const response = await fetch(
      `${process.env.VITE_APP_USER_BACKEND_MODEL_URL}/add-api`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.VITE_APP_API_KEY || "",
          Cookie: `access-token=${
            session.getAcessAndRefreshToken().accessToken
          }; refresh-token=${session.getAcessAndRefreshToken().refreshToken};`,
        },
        body: JSON.stringify({
          userId: user.id,
          websiteUrl,
          websiteName,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return json(
        { success: false, message: error || "Failed to create API" },
        { status: response.status }
      );
    }

    const data = await response.json();
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

export default function Try() {
  const { t } = useTranslation();
  const [chat, setChat] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData<{ success: boolean; message: string }>();
  const submit = useSubmit();

  // Handle form submission result
  if (actionData) {
    if (actionData.success) {
      toast({
        title: "Success",
        description: "API created successfully",
      });
      // Navigate to profile (would be handled by the client)
      setTimeout(() => {
        window.location.href = "/home/profile";
      }, 1500);
    } else {
      toast({
        title: "Error",
        description: actionData.message || "Failed to create API",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="relative w-full min-h-svh overflow-hidden bg-gradient-to-b from-white via-purple-50 to-white dark:from-[#13111C] dark:via-[#1F1B3C] dark:to-[#13111C]">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute w-full h-full animate-gradient-y">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-purple-300/30 to-purple-300/30 dark:from-purple-600/20 dark:via-transparent dark:to-purple-600/20" />
        </div>
      </div>

      <div className="absolute inset-0 w-full h-full">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
            animate={{
              y: [-20, -40, -20],
              x: i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + (i % 2),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center pt-16 pb-10 px-4">
        <h1 className="text-[3rem] sm:text-[4rem] font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent mb-8">
          Try ChatPilot
        </h1>

        <div className="flex justify-center items-center mb-8 gap-4">
          <Button
            onClick={() => setChat(!chat)}
            variant="outline"
            className="bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg z-10"
          >
            {chat ? "Create API Key" : "Try Chat"}
          </Button>
          <Link to="/home">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <ModeToggle />
        </div>

        {!chat ? (
          <div className="flex flex-col w-full items-center max-w-xl bg-white/80 dark:bg-gray-800/70 p-8 rounded-xl shadow-lg backdrop-blur-sm">
            <Form method="post" className="w-full space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Enter Website Details
              </h2>

              <div className="space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="websiteName">Website Name</Label>
                  <Input
                    id="websiteName"
                    name="websiteName"
                    placeholder="My Website"
                    className="bg-white/90 dark:bg-gray-700/90"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    placeholder="https://example.com"
                    className="bg-white/90 dark:bg-gray-700/90"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating API...
                    </>
                  ) : (
                    "ChatPilot your website"
                  )}
                </Button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="flex flex-col w-full items-center max-w-xl bg-white/80 dark:bg-gray-800/70 p-8 rounded-xl shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Chat Feature Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're currently working on implementing the chat interface.
            </p>
          </div>
        )}

        <Link
          to="/home/profile"
          className="mt-8 text-gray-800 dark:text-gray-200 flex items-center gap-2"
        >
          Access existing keys in
          <span className="text-purple-600 dark:text-purple-400 font-medium">
            Your Profile
          </span>
        </Link>
      </div>
    </div>
  );
}
