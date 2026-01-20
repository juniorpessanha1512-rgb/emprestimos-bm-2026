import { createClient } from '@supabase/supabase-js';

// Configurar com suas credenciais do Supabase
// Você pode obter essas informações em: https://supabase.com/dashboard/project/[seu-projeto]/settings/api

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xeshtpqzrcigihupxura.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc2h0cHF6cmNpZ2lodXB4dXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MzE0MjUsImV4cCI6MTc2OTAyNzQyNX0.xU9qMqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funções auxiliares para criar tabelas se não existirem
export async function initializeDatabase() {
  try {
    // Verificar se as tabelas já existem
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    console.log('Tabelas existentes:', tables);
  } catch (error) {
    console.log('Banco de dados ainda não inicializado');
  }
}
