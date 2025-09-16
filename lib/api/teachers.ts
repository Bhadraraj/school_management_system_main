import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { mockData, mockApiDelay } from './mock-data';
import { isSupabaseConfigured } from '@/lib/supabase';

export type Teacher = Database['public']['Tables']['teachers']['Row'];
export type TeacherInsert = Database['public']['Tables']['teachers']['Insert'];
export type TeacherUpdate = Database['public']['Tables']['teachers']['Update'];

export const teachersApi = {
  // Get all teachers with profile and subject data
  async getAll() {
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.teachers;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.teachers.find(t => t.id === id) || null;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const newTeacher = {
        ...teacher,
        id: `teacher-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: { 
          id: teacher.profile_id, 
          name: 'Demo Teacher', 
          email: 'demo@school.edu',
          phone: '+1 234 567 8900'
        },
        subjects: { id: teacher.subject_id, name: 'Demo Subject', code: 'DEMO101' },
        classes: []
      };
      mockData.teachers.push(newTeacher as any);
      return newTeacher;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.teachers.findIndex(t => t.id === id);
      if (index !== -1) {
        mockData.teachers[index] = { ...mockData.teachers[index], ...updates };
        return mockData.teachers[index];
      }
      throw new Error('Teacher not found');
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.teachers.findIndex(t => t.id === id);
      if (index !== -1) {
        mockData.teachers.splice(index, 1);
      }
      return;
    }

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