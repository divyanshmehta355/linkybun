"use server";

import { createClient } from "@/lib/supabase/server";

export async function logClick(linkId: string, referrer: string) {
  const supabase = await createClient();
  
  // Best effort, fire and forget
  await supabase.from("clicks").insert({
    link_id: linkId,
    referrer: referrer || null,
  });
}
