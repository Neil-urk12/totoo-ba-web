import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Create a singleton Supabase client instance
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// Export the same instance via function for consistency
export const createSupabaseClient = () => supabase
