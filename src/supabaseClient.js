import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xbrocukrvcflvuagxbes.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhicm9jdWtydmNmbHZ1YWd4YmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODA2NTUsImV4cCI6MjEwMzU1NjY1NX0.KcJzacTodIiGFzcFTuNMzdB4i6Ux_3DTNA7bP4-42-E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
