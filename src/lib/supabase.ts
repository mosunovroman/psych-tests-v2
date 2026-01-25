import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      test_results: {
        Row: {
          id: string
          user_id: string
          test_id: string
          test_name: string
          score: number
          max_score: number
          level: string
          title: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['test_results']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['test_results']['Insert']>
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          messages: any[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>
      }
    }
  }
}
