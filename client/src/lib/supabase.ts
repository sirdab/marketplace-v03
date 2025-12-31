import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ydaqasveqnkocnnpshtl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYXFhc3ZlcW5rb2NubnBzaHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzNTYyMTksImV4cCI6MjAxNDkzMjIxOX0.6mt9nIVgHg27spGYGEFQvEO8pYVojLY7W5swh3E9kzA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
