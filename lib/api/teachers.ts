import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Teacher = Database['public']['Tables']['teachers']['Row'];
export type TeacherInsert = Database['public']['Tables']['teachers']['Insert'];
export type TeacherUpdate = Database['public']['Tables']['teachers']['Update'];

export const teachersApi = {
  // Get all teachers with profile and subject data
  async getAll() {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        profiles:profile_id (
          id,
          name,
          email,
          phone,
          avatar_url
        ),
        subjects:subject_id (
          id,
          name,
          code
        )
      `)
      .order('created_at');

    if (error) throw error;
    return data;
  },

  // Get teacher by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        profiles:profile_id (
          id,
          name,
          email,
          phone,
          avatar_url,
          address
        ),
        subjects:subject_id (
          id,
          name,
          code
        ),
        classes:classes!teacher_id (
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

  // Create new teacher
  async create(teacher: TeacherInsert) {
    const { data, error } = await supabase
      .from('teachers')
      .insert(teacher)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update teacher
  async update(id: string, updates: TeacherUpdate) {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete teacher
  async delete(id: string) {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get teacher by profile ID
  async getByProfileId(profileId: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        subjects:subject_id (
          id,
          name,
          code
        ),
        classes:classes!teacher_id (
          id,
          name
        )
      `)
      .eq('profile_id', profileId)
      .single();

    if (error) throw error;
    return data;
  },

  // Search teachers
  async search(query: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        profiles:profile_id (
          id,
          name,
          email,
          phone
        ),
        subjects:subject_id (
          id,
          name
        )
      `)
      .or(`profiles.name.ilike.%${query}%,subjects.name.ilike.%${query}%`)
      .order('created_at');

    if (error) throw error;
    return data;
  },
};