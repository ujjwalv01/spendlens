import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type AuditRecord = {
  id?: string
  slug: string
  tools_data: Record<string, unknown>[]
  savings_data: Record<string, unknown>
  use_case: string
  team_size: string
  created_at?: string
}

export type LeadRecord = {
  id?: string
  email: string
  company_name?: string
  role?: string
  team_size?: string
  audit_slug: string
  total_monthly_savings?: number
  created_at?: string
}
