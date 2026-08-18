import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PublicLinkItem } from "@/components/profile/public-link-item";
import { Metadata } from "next";

export const instant = false;

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Not Found" };

  const title = `${profile.username} | LinkyBun`;
  const description = profile.bio || `Check out ${profile.username}'s links!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("active", true)
    .order("position", { ascending: true });

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 md:p-10 pt-20">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden border-2 border-border shadow-sm">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.username} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold uppercase text-muted-foreground">
              {profile.username.charAt(0)}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">@{profile.username}</h1>
        
        {profile.bio && (
          <p className="text-center text-muted-foreground mb-8">
            {profile.bio}
          </p>
        )}
        
        <div className="w-full mt-4 flex flex-col gap-3">
          {links && links.length > 0 ? (
            links.map(link => (
              <PublicLinkItem key={link.id} link={link} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No links available yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
