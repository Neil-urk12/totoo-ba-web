/**
 * Supabase Database Client Configuration
 * 
 * This module initializes and exports the Supabase client for database operations.
 * It uses environment variables for configuration and provides a singleton instance
 * to ensure consistent database connections throughout the application.
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Supabase project URL from environment variables
 * @constant {string}
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/**
 * Supabase anonymous/publishable API key from environment variables
 * @constant {string}
 */
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/**
 * Singleton Supabase client instance
 * 
 * This client is configured with the project URL and publishable key.
 * It provides access to all Supabase features including:
 * - Database queries (PostgreSQL)
 * - Real-time subscriptions
 * - Authentication
 * - Storage
 * 
 * @constant {SupabaseClient}
 * @example
 * import { supabase } from './db/supabaseClient'
 * 
 * // Query data
 * const { data, error } = await supabase
 *   .from('food_products')
 *   .select('*')
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

/**
 * Factory function that returns the singleton Supabase client instance
 * 
 * This function is provided for consistency with patterns where a factory
 * function is preferred over direct imports. It always returns the same
 * singleton instance as the `supabase` export.
 * 
 * @returns {SupabaseClient} The singleton Supabase client instance
 * @example
 * import { createSupabaseClient } from './db/supabaseClient'
 * 
 * const client = createSupabaseClient()
 * const { data } = await client.from('drug_products').select('*')
 */
export const createSupabaseClient = () => supabase
