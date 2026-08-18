import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LinkList } from "@/components/dashboard/link-list";
import { AddLinkForm } from "@/components/dashboard/add-link-form";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return redirect("/onboarding");
  }

  // Fetch links
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", user.id)
    .order("position", { ascending: true });

  return (
    <div className="flex-1 w-full flex flex-col items-center max-w-4xl mx-auto p-4 md:p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-muted-foreground">
            linkybun.com/{profile.username}
          </span>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline"
          >
            View Profile
          </a>
        </div>
      </div>
      
      <div className="w-full grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-8">
          <AddLinkForm />
          <LinkList initialLinks={links || []} />
        </div>
        
        <div>
          {/* We'll add Analytics in Task 4, and Pro Upgrade in Task 5 here later */}
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold mb-2">Welcome, {profile.username}!</h3>
            <p className="text-sm text-muted-foreground">
              Add some links and reorder them by dragging. Changes are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
