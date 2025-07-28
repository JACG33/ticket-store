import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"

const supabase = createClient(
	'https://kuimahrftawdqfjskrcx.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1aW1haHJmdGF3ZHFmanNrcmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTIzNzIsImV4cCI6MjA2NTgyODM3Mn0.wdPl3OYU5TIiggkxp_GJBMo3oE1TP6eNAx7oYr6Gk3Y'
)

export default supabase