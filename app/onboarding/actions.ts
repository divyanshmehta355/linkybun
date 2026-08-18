"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;

  if (!username) {
    return { error: "Username is required" };
  }

  // Attempt to insert profile
  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    username,
    bio,
  });

  if (error) {
    if (error.code === "23505") { // unique violation
      return { error: "Username is already taken" };
    }
    return { error: "An error occurred while creating your profile" };
  }

  redirect("/dashboard");
}
