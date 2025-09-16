import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { mockData, mockApiDelay } from './mock-data';
import { isSupabaseConfigured } from '@/lib/supabase';

export type Subject = Database['public']['Tables']['subjects']['Row'];
export type SubjectInsert = Database['public']['Tables']['subjects']['Insert'];
export type SubjectUpdate = Database['public']['Tables']['subjects']['Update'];

export const subjectsApi = {
  // Get all subjects
  async getAll() {
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.subjects;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.subjects.find(s => s.id === id) || null;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const newSubject = {
        ...subject,
        id: `subject-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        teachers: [],
        classes: []
      };
      mockData.subjects.push(newSubject as any);
      return newSubject;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.subjects.findIndex(s => s.id === id);
      if (index !== -1) {
        mockData.subjects[index] = { ...mockData.subjects[index], ...updates };
        return mockData.subjects[index];
      }
      throw new Error('Subject not found');
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.subjects.findIndex(s => s.id === id);
      if (index !== -1) {
        mockData.subjects.splice(index, 1);
      }
      return;
    }

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