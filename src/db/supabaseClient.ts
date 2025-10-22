import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Export a function to create a Supabase client on-demand
export const createSupabaseClient = () => createClient(supabaseUrl, supabasePublishableKey)

// Keep the default export for backward compatibility but mark as deprecated
/** @deprecated Use createSupabaseClient() instead for code splitting */
export const supabase = createSupabaseClient()
