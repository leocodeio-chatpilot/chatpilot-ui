import { useState } from "react";
import { useLoaderData, Form, Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserInput } from "@/components/self/user-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userSession } from "~/services/sessions.server";
import { redirect } from "@remix-run/node";
import { me } from "@/services/auth.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export async function loader({ request }: any) {
  const session = await userSession(request);
  const isAuthenticated = session.isAuthenticated();
  console.log("---1---start home/profile.ts", isAuthenticated);
  if (!isAuthenticated) {
    return redirect("/auth/signin");
  }
  const role = session.getRole();
  console.log("---2---start home/profile.ts", role);
  if (!role) {
    return redirect("/auth/signin");
  }
  // Get user details from the me endpoint
  const meResponse = await me(role, request);
  if (!meResponse.ok) {
    return redirect("/auth/signin");
  }
  console.log("---3---start home/profile.ts", meResponse);
  const userData = await meResponse.json();
  console.log("---3.1---start home/profile.ts", userData.payload.apiKeys);
  return { user: userData.payload.user, apikeys: userData.payload.apiKeys };
}

export default function Profile() {
  const { user, apikeys } = useLoaderData<typeof loader>();
  console.log("---4---start home/profile.ts", user);
  const [name, setName] = useState(user?.username || "");
  const [email] = useState(user?.email || "");
  const [apiKeys] = useState<any[]>(apikeys || []);
  const [selectedWebsite, setSelectedWebsite] = useState(
    "N/A(select a website)"
  );
  console.log("---5---start home/profile.ts", apiKeys);

  const selectedApiKey =
    apiKeys.find((api) => api.website_name === selectedWebsite)?.api_key ||
    "N/A";

  const handleWebsiteChange = (value: string) => {
    setSelectedWebsite(value);
  };

  return (
    <div className="flex flex-col">
      <Card className="w-full max-w-sm mx-auto  my-20">
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button disabled variant="secondary" size="sm">
                Hello {name}
              </Button>
            </div>

            {/* Profile Form */}
            <Form method="post" className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" type="text" value={user?.role} disabled />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium">Select Website</label>
                <Select
                  value={selectedWebsite}
                  onValueChange={handleWebsiteChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a website" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N/A(select a website)">
                      N/A(select a website from dropdown)
                    </SelectItem>
                    {apiKeys.map((api: any) => (
                      <SelectItem
                        key={api.website_name.toString()}
                        value={api.website_name.toString()}
                      >
                        {api.website_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex items-center p-2 rounded-md border bg-background">
                    <code className="text-sm font-mono w-full overflow-x-auto">
                      {selectedApiKey ? selectedApiKey : "N/A"}
                    </code>
                    {selectedApiKey && selectedApiKey !== "N/A" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-8 px-2"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedApiKey);
                          toast({
                            title: "Copied!",
                            description: "API key copied to clipboard",
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        <span className="sr-only">Copy</span>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 mt-4">
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/feature/try">Create new API</Link>
                  </Button>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/feature/chat">Demo a API key</Link>
                  </Button>
                </div>
              </div>
              <Button disabled type="submit" className="w-full">
                Save Changes
              </Button>
              <Link
                to="/home"
                className="w-full text-center outline outline-1 outline-gray-300 rounded-md p-2 hover:bg-gray-900"
              >
                Home
              </Link>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
