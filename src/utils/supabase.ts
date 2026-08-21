import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export type StoredRow<T> = { id: number; data: T; updated_at?: string };

function client() {
  if (!supabase) throw new Error('Supabase não configurado');
  return supabase;
}

export async function readCollection<T>(table: 'projects' | 'clients'): Promise<T[]> {
  const { data, error } = await client().from(table).select('id,data').order('id');
  if (error) throw error;
  return (data as StoredRow<T>[]).map(row => row.data);
}

export async function writeCollection<T extends { id: number }>(table: 'projects' | 'clients', values: T[]) {
  const updatedAt = new Date().toISOString();
  if (values.length) {
    const { error } = await client()
      .from(table)
      .upsert(values.map(data => ({ id: data.id, data, updated_at: updatedAt })), { onConflict: 'id' });
    if (error) throw error;
  }

  const keep = values.map(value => value.id).join(',');
  const deletion = keep
    ? client().from(table).delete().not('id', 'in', `(${keep})`)
    : client().from(table).delete().not('id', 'is', null);
  const { error } = await deletion;
  if (error) throw error;
}

export async function readSettings<T>(): Promise<T | null> {
  const { data, error } = await client()
    .from('account_settings')
    .select('data')
    .eq('id', 'agency')
    .maybeSingle();
  if (error) throw error;
  return (data?.data as T | undefined) ?? null;
}

export async function writeSettings<T>(data: T) {
  const { error } = await client().from('account_settings').upsert({
    id: 'agency',
    data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
