
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  const val = process.env[key] || (window as any).process?.env?.[key];
  if (val === "undefined" || val === "null" || !val) return "";
  return String(val).trim();
};

// Usando as credenciais fornecidas pelo usuário como padrão
const supabaseUrl = getEnv("VITE_SUPABASE_URL") || "https://zlaogmxxrjaipogyzwrn.supabase.co";
const supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY") || "sb_publishable_Hsw9xaSw7bMQWZ_SlwXpTA_bZp74SSR";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase não configurado corretamente.");
} else {
  console.log("%c✓ Delivery Pira: Supabase Conectado (zlaogmxxrjaipogyzwrn)!", "color: #10b981; font-weight: bold;");
}
