import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LinkList } from "@/components/dashboard/link-list";
import { AddLinkForm } from "@/components/dashboard/add-link-form";
import { Analytics } from "@/components/dashboard/analytics";
import { UpgradeButton } from "@/components/dashboard/upgrade-button";
import { MainLayout } from "@/components/layout/main-layout";

export const instant = false;

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

  // Fetch analytics via RPC
  const { data: analyticsData, error: analyticsError } = await supabase
    .rpc("get_link_analytics", { p_profile_id: user.id });

  if (analyticsError) {
    console.error("Analytics Error:", analyticsError);
  }

  return (
    <MainLayout>
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
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View Profile &rarr;
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-muted/50 p-4 rounded-xl border border-dashed">
              <AddLinkForm />
            </div>

            <LinkList initialLinks={links || []} />
          </div>

          <div className="w-full md:w-80 flex flex-col gap-6">
            <Analytics data={analyticsData || []} />
            <UpgradeButton isPro={profile.is_pro} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
