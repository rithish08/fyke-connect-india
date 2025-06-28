import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://ogalytywmafaztluhjzd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWx5dHl3bWFmYXp0bHVoanpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTUzMzEsImV4cCI6MjA2NTU3MTMzMX0.Xrc4aKFsarDQw4-4GFWrWU4RvtmIc7kVfPgaruAsd94'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
