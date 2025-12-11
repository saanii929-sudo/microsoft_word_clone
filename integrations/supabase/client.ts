import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Note: In Next.js, client-side env vars must be prefixed with NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfdvxelsphqbuaezepqs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZHZ4ZWxzcGhxYnVhZXplcHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzk4ODUsImV4cCI6MjA4MDk1NTg4NX0.kw58XqvAKDRUWRh0XqZIxTwRta7Hm-Ff1XVYCdstVqw';

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase configuration is missing!');
  console.error('URL:', supabaseUrl);
  console.error('Key present:', !!supabaseKey);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Log configuration on client side (for debugging)
if (typeof window !== 'undefined') {
  console.log('Supabase client initialized:', {
    url: supabaseUrl,
    keyLength: supabaseKey?.length || 0,
    keyPrefix: supabaseKey?.substring(0, 30) || 'missing',
    usingEnvVar: !!process.env.NEXT_PUBLIC_SUPABASE_KEY || !!process.env.SUPABASE_KEY
  });
}

export default supabase;