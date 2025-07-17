import { supabase } from "@/lib/supabase";

export async function ensureUserProfile(user) {
  // Try to fetch the user profile
  const { data: existingProfile, error: selectError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existingProfile) {
    return existingProfile.id; // Use this UUID for all operations
  }

  // If not found, create it
  const { data: newProfile, error: insertError } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || null,
        picture: user.user_metadata?.picture || user.user_metadata?.avatar_url || null,
      },
    ])
    .select()
    .single();

  if (insertError) {
    throw new Error("Failed to create user profile: " + insertError.message);
  }

  return newProfile.id;
} 