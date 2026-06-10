'use strict';

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tzvfkdqzdkftcqfourom.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dmZrZHF6ZGtmdGNxZm91cm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTA2MTQsImV4cCI6MjA4NDUyNjYxNH0.Ajmg36iq6Aj3x9L5DjpYZKOYpnjImqxVtU9rw5vkEAM';

function createAuthClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

module.exports = { createAuthClient, SUPABASE_URL, SUPABASE_ANON_KEY };
