import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase configuration
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  throw new Error(
    'Invalid or missing VITE_SUPABASE_URL. Please update your .env file with your actual Supabase project URL.' +
    '\nYou can find this in your Supabase dashboard under Project Settings > API'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
  throw new Error(
    'Invalid or missing VITE_SUPABASE_ANON_KEY. Please update your .env file with your actual Supabase anon key.' +
    '\nYou can find this in your Supabase dashboard under Project Settings > API > anon/public key'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { User } from '@supabase/supabase-js'