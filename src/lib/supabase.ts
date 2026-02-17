import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use service role key if available for server-side operations to bypass RLS if needed,
// but for client-side, use anon key.
// Ideally usage should be separated, but for MVP utility this works.
export const supabase = createClient(supabaseUrl, supabaseKey);
