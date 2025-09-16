import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { mockData, mockApiDelay } from './mock-data';
import { isSupabaseConfigured } from '@/lib/supabase';

export type Class = Database['public']['Tables']['classes']['Row'];
export type ClassInsert = Database['public']['Tables']['classes']['Insert'];
export type ClassUpdate = Database['public']['Tables']['classes']['Update'];

export const classesApi = {
  // Get all classes with related data
  async getAll() {
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.classes;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.classes.find(c => c.id === id) || null;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const newClass = {
        ...classData,
        id: `class-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        teachers: { id: classData.teacher_id, profiles: { name: 'Demo Teacher' } },
        subjects: { id: classData.subject_id, name: 'Demo Subject', code: 'DEMO101' },
        students: []
      };
      mockData.classes.push(newClass as any);
      return newClass;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.classes.findIndex(c => c.id === id);
      if (index !== -1) {
        mockData.classes[index] = { ...mockData.classes[index], ...updates };
        return mockData.classes[index];
      }
      throw new Error('Class not found');
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.classes.findIndex(c => c.id === id);
      if (index !== -1) {
        mockData.classes.splice(index, 1);
      }
      return;
    }

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