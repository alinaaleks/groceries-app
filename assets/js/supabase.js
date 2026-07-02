import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 1. Replace these:
const SUPABASE_URL = "https://aewbvdmzfrsemvidppri.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2J2ZG16ZnJzZW12aWRwcHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTAyMDMsImV4cCI6MjA5ODU2NjIwM30.FNdVcufwqhZULz-c4fIH41U2Bvqw7zuV8f1pSqPAf24";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);