
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  const val = process.env[key] || (window as any).process?.env?.[key];
  if (val === "undefined" || val === "null" || !val) return "";
  return String(val).trim();
};

const supabaseUrl = getEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY");

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente.");
} else {
  console.log("%c✓ Delivery Pira: Supabase Conectado!", "color: #10b981; font-weight: bold;");
}
