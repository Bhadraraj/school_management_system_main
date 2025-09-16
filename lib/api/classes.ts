import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Class = Database['public']['Tables']['classes']['Row'];
export type ClassInsert = Database['public']['Tables']['classes']['Insert'];
export type ClassUpdate = Database['public']['Tables']['classes']['Update'];

export const classesApi = {
  // Get all classes with related data
  async getAll() {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        teachers:teacher_id (
          id,
          profiles:profile_id (
            name
          )
        ),
        subjects:subject_id (
          id,
          name,
          code
        ),
        students:students!class_id (
          id
        )
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get class by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        teachers:teacher_id (
          id,
          profiles:profile_id (
            name,
            email,
            phone
          )
        ),
        subjects:subject_id (
          id,
          name,
          code
        ),
        students:students!class_id (
          id,
          name,
          roll_number,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new class
  async create(classData: ClassInsert) {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update class
  async update(id: string, updates: ClassUpdate) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete class
  async delete(id: string) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get classes by teacher
  async getByTeacher(teacherId: string) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        subjects:subject_id (
          name
        ),
        students:students!class_id (
          id
        )
      `)
      .eq('teacher_id', teacherId)
      .order('name');

    if (error) throw error;
    return data;
  },
};