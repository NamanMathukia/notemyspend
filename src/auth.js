import { supabase } from "./supabase";

export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
  });
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.reload();
}

export function getUser() {
  return supabase.auth.getUser();
}
