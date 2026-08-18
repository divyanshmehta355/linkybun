import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createProfile } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profile) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Claim your link</CardTitle>
            <CardDescription>
              Choose a unique username for your LinkyBun profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createProfile}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="e.g. awesome-creator"
                    required
                    pattern="^[a-zA-Z0-9_-]+$"
                    title="Only letters, numbers, underscores, and hyphens"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Input
                    id="bio"
                    name="bio"
                    type="text"
                    placeholder="A short description about yourself"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Continue to Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
