import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://soxgqyjaeouwdyykoueq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveGdxeWphZW91d2R5eWtvdWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI4OTA4NDUsImV4cCI6MjAxODQ2Njg0NX0.CbgxIgxRJXFKOJ2ssZ3PpHeG-3KOgsocGh6SMtKyfOw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
