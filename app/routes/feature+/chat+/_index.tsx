import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { action as queryApiAction } from "~/routes/action+/feature+/chat+/queryApi.action";
import { Home } from "lucide-react";
import { ModeToggle } from "~/components/mode-toggle";
import { motion } from "framer-motion";
export const action = queryApiAction;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Now we use useNavigation and useActionData hooks instead of handling submission manually
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData<{
    success: boolean;
    message: string;
    data: any;
  }>();

  // Create chat scroll ref hook
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when chat data changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatData]);

  // Handle the response from the action
  useEffect(() => {
    if (actionData) {
      console.log("Action Data:", actionData);
      if (actionData.success) {
        // Update chat with the response
        console.log(chatData);
        setChatData((prev) => [
          ...prev,
          { role: "user", content: chatInput },
          { role: "assistant", content: actionData.data.payload.response },
        ]);
        // Reset the input field
        setChatInput("");
      } else {
        toast({
          title: "Error",
          description: actionData.message,
          variant: "destructive",
        });
      }
    }
  }, [actionData]);

  // Validate before submission
  const validateBeforeSubmit = (event: React.FormEvent) => {
    if (apiKey === "") {
      event.preventDefault();
      toast({
        title: "API Key Required",
        description: "Please enter your API key to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!chatInput.trim()) {
      event.preventDefault();
      toast({
        title: "Empty Message",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="relative w-full min-h-svh overflow-hidden bg-gradient-to-b from-white via-purple-50 to-white dark:from-[#13111C] dark:via-[#1F1B3C] dark:to-[#13111C]">
      {/* Gradient background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute w-full h-full animate-gradient-y">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-purple-300/30 to-purple-300/30 dark:from-purple-600/20 dark:via-transparent dark:to-purple-600/20" />
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 w-full h-full">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative flex flex-col min-h-svh w-full max-w-4xl mx-auto p-4 md:p-6">
        {/* Header section with title and navigation */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
            ChatPilot Demo
          </h1>
          <div className="flex gap-2">
            <Link to="/home">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>

        <Card className="flex-1 flex flex-col shadow-lg mb-4 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm border-0">
          <CardContent className="p-0 flex-1 flex flex-col">
            {/* Chat messages area */}
            <div
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 bg-white/50 dark:bg-gray-900/50 flex-1 rounded-t-lg"
            >
              {chatData.length > 0 ? (
                chatData.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span
                      className={`px-4 py-2 rounded-lg max-w-[70%] ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-purple-200 dark:border-purple-900/30"
                      } shadow-sm`}
                    >
                      {message.content}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">
                    Enter your API key and start a conversation!
                  </p>
                </div>
              )}

              {isSubmitting && (
                <div className="flex justify-start">
                  <span className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-purple-200 dark:border-purple-900/30 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </span>
                </div>
              )}
            </div>

            {/* API Key input */}
            <div className="border-t border-purple-100 dark:border-purple-900/30 p-4 bg-white/90 dark:bg-gray-800/90">
              <input
                type="text"
                value={apiKey}
                placeholder="Enter your API key here..."
                onChange={(e) => setApiKey(e.target.value)}
                className="p-3 w-full bg-white/90 dark:bg-gray-700/90 border border-purple-200 dark:border-purple-900/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 text-sm placeholder-muted-foreground"
              />
            </div>

            {/* Message input and send button */}
            <Form
              method="post"
              onSubmit={validateBeforeSubmit}
              className="flex items-center p-4 border-t border-purple-100 dark:border-purple-900/30 bg-white/90 dark:bg-gray-800/90 gap-2 rounded-b-lg"
            >
              {/* Hidden input for API key */}
              <input type="hidden" name="apiKey" value={apiKey} />

              {/* Chat input */}
              <input
                type="text"
                name="queryText" // Important: name matches what the action expects
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-3 rounded-md bg-white/90 dark:bg-gray-700/90 border border-purple-200 dark:border-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 text-sm placeholder-muted-foreground"
                disabled={isSubmitting}
              />

              {/* Submit button */}
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                disabled={isSubmitting || !apiKey || !chatInput.trim()}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-800 dark:text-gray-200">
          <div className="flex justify-center gap-4">
            <p>
              <Link
                to="/home/profile"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Get API key from profile
              </Link>
            </p>
            <p>
              <Link
                to="/feature/try"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Back to API creation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
