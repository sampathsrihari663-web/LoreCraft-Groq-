import { createClient } from "@supabase/supabase-js";

// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND PUBLIC KEY
const SUPABASE_URL = "https://ezqyiqzfztpqkaxjzfcd.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_CZmQ28db2aBMW3ZSv_XIEQ_zsb2Atd9";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
