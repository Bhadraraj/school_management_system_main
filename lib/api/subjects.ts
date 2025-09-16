import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Subject = Database['public']['Tables']['subjects']['Row'];
export type SubjectInsert = Database['public']['Tables']['subjects']['Insert'];
export type SubjectUpdate = Database['public']['Tables']['subjects']['Update'];

export const subjectsApi = {
  // Get all subjects
  async getAll() {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        teachers:teachers!subject_id (
          id,
          profiles:profile_id (
            name
          )
        ),
        classes:classes!subject_id (
          id,
          name
        )
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get subject by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        teachers:teachers!subject_id (
          id,
          profiles:profile_id (
            name,
            email
          )
        ),
        classes:classes!subject_id (
          id,
          name,
          capacity
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new subject
  async create(subject: SubjectInsert) {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update subject
  async update(id: string, updates: SubjectUpdate) {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete subject
  async delete(id: string) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Search subjects
  async search(query: string) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .or(`name.ilike.%${query}%,code.ilike.%${query}%`)
      .order('name');

    if (error) throw error;
    return data;
  },
};