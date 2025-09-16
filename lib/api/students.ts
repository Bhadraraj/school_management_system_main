import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Student = Database['public']['Tables']['students']['Row'];
export type StudentInsert = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

export const studentsApi = {
  // Get all students with related data
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes:class_id (
          id,
          name
        ),
        profiles:parent_id (
          id,
          name,
          phone,
          email
        )
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get student by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes:class_id (
          id,
          name,
          teacher_id,
          teachers:teacher_id (
            id,
            profiles:profile_id (
              name
            )
          )
        ),
        profiles:parent_id (
          id,
          name,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new student
  async create(student: StudentInsert) {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update student
  async update(id: string, updates: StudentUpdate) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete student
  async delete(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get students by class
  async getByClass(classId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_id', classId)
      .order('roll_number');

    if (error) throw error;
    return data;
  },

  // Get students by parent
  async getByParent(parentId: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes:class_id (
          id,
          name
        )
      `)
      .eq('parent_id', parentId)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Search students
  async search(query: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes:class_id (
          id,
          name
        )
      `)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,roll_number.ilike.%${query}%`)
      .order('name');

    if (error) throw error;
    return data;
  },
};