"use client";

// Browser-side Supabase auth helpers for the admin area.
// When Supabase is configured, AdminGate uses real email/password sessions;
// otherwise it falls back to the demo PIN (see components/AdminGate.js).

import { supabase, isSupabaseConfigured } from "./supabaseClient";

export { isSupabaseConfigured };

// Resolve the current admin session. Returns { user } or { user: null }.
export async function getAdminUser() {
  if (!isSupabaseConfigured) return { user: null };
  const { data, error } = await supabase.auth.getSession();
  if (error) return { user: null };
  return { user: data.session?.user ?? null };
}

export function onAuthChange(callback) {
  if (!isSupabaseConfigured) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}

export async function signInAdmin(email, password) {
  if (!isSupabaseConfigured) {
    return { error: { message: "Supabase is not configured." } };
  }
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}
