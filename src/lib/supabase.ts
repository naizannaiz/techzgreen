import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// In development, route through Vite proxy to bypass CORS
const clientUrl =
  import.meta.env.DEV
    ? `${window.location.origin}/supabase-api`
    : supabaseUrl;

export const supabase = createClient(clientUrl, supabaseAnonKey);
