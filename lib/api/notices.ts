import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Notice = Database['public']['Tables']['notices']['Row'];
export type NoticeInsert = Database['public']['Tables']['notices']['Insert'];
export type NoticeUpdate = Database['public']['Tables']['notices']['Update'];

export const noticesApi = {
  // Get all notices
  async getAll() {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (
          id,
          name
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get notice by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new notice
  async create(notice: NoticeInsert) {
    const { data, error } = await supabase
      .from('notices')
      .insert(notice)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update notice
  async update(id: string, updates: NoticeUpdate) {
    const { data, error } = await supabase
      .from('notices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete notice
  async delete(id: string) {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get notices by target audience
  async getByAudience(audience: string) {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (
          name
        )
      `)
      .or(`target_audience.eq.${audience},target_audience.eq.all`)
      .eq('status', 'active')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get recent notices
  async getRecent(limit: number = 5) {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (
          name
        )
      `)
      .eq('status', 'active')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Search notices
  async search(query: string) {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (
          name
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },
};