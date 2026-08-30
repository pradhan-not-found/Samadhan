const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xbrocukrvcflvuagxbes.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhicm9jdWtydmNmbHZ1YWd4YmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODA2NTUsImV4cCI6MjEwMzU1NjY1NX0.KcJzacTodIiGFzcFTuNMzdB4i6Ux_3DTNA7bP4-42-E';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkReports() {
  const { data, error } = await supabase.from('reports').select('*').limit(1);
  console.log('Reports sample:', data ? JSON.stringify(data, null, 2) : error);
}

checkReports();
