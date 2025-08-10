import { createClient } from '@supabase/supabase-js'

// Public project keys (client-safe)
const supabaseUrl = 'https://jxhjghgectlpgrpwpkfd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aGpnaGdlY3RscGdycHdwa2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTczMjEsImV4cCI6MjA2OTc5MzMyMX0.jW7dx-xlp3qgEUs9rsKFLr5GpX22Qd_RKstSTLAWoNo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)