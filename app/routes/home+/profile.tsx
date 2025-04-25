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
import { userSession } from "@/services/sessions.server";
import { redirect } from "@remix-run/node";
import { me } from "@/services/auth.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return { user: userData.payload.user };
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  console.log("---4---start home/profile.ts", user);
  const [name, setName] = useState(user?.username || "");
  const [email] = useState(user?.email || "");
  const [apiKeys] = useState<any[]>(user?.apiKeys || []);
  const [selectedWebsite, setSelectedWebsite] = useState("N/A");

  const selectedApiKey =
    apiKeys.find((api) => api.website_name === selectedWebsite)?.api_key ||
    "N/A";

  const handleWebsiteChange = (value: string) => {
    setSelectedWebsite(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
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
                <AvatarImage src="/logo.png" alt="@user" />
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button disabled variant="secondary" size="sm">
                Hello {name}
              </Button>
            </div>

            {/* Profile Form */}
            <Form method="post" className="flex flex-col gap-4">
              <div className="grid gap-2">
                <UserInput
                  id="name"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
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
                    <SelectItem value="N/A">N/A</SelectItem>
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
                  </div>
                </div>

                <div className="grid gap-2 mt-4">
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/try">Create new API</Link>
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
