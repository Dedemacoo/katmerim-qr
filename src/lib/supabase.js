import { createClient } from "@supabase/supabase-js";

const STORAGE_KEY_SUPABASE_URL = "katmerim_supabase_url";
const STORAGE_KEY_SUPABASE_KEY = "katmerim_supabase_anon_key";

export function getSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || "https://pvrztlydhqblvktprija.supabase.co";
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const savedUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || envUrl;
  const savedKey = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || envKey;

  return { url: savedUrl, anonKey: savedKey };
}

export function saveSupabaseConfig(url, anonKey) {
  if (url) localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
  if (anonKey) localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, anonKey.trim());
}

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey);
  } catch (err) {
    console.error("Supabase client init error:", err);
    return null;
  }
}
