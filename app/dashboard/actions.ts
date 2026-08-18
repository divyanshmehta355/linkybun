"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addLink(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  if (!title || !url) return { error: "Title and URL are required" };

  // Get current max position
  const { data: links } = await supabase
    .from("links")
    .select("position")
    .eq("profile_id", user.id)
    .order("position", { ascending: false })
    .limit(1);

  const position = links && links.length > 0 ? links[0].position + 1 : 0;

  const { error } = await supabase.from("links").insert({
    profile_id: user.id,
    title,
    url,
    position,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateLink(id: string, updates: { title?: string; url?: string; active?: boolean }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLink(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function reorderLinks(items: { id: string; position: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Update positions one by one. In a real app we might use a bulk update RPC.
  for (const item of items) {
    await supabase
      .from("links")
      .update({ position: item.position })
      .eq("id", item.id)
      .eq("profile_id", user.id);
  }

  revalidatePath("/dashboard");
  return { success: true };
}
