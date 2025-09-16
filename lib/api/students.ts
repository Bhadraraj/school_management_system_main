import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { mockData, mockApiDelay } from './mock-data';
import { isSupabaseConfigured } from '@/lib/supabase';

export type Student = Database['public']['Tables']['students']['Row'];
export type StudentInsert = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

export const studentsApi = {
  // Get all students with related data
  async getAll() {
    // Use mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.students;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.students.find(s => s.id === id) || null;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const newStudent = {
        ...student,
        id: `student-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        classes: { id: student.class_id, name: 'Demo Class' },
        profiles: { id: student.parent_id, name: 'Demo Parent', phone: '+1 234 567 8900' }
      };
      mockData.students.push(newStudent as any);
      return newStudent;
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.students.findIndex(s => s.id === id);
      if (index !== -1) {
        mockData.students[index] = { ...mockData.students[index], ...updates };
        return mockData.students[index];
      }
      throw new Error('Student not found');
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      const index = mockData.students.findIndex(s => s.id === id);
      if (index !== -1) {
        mockData.students.splice(index, 1);
      }
      return;
    }

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get students by class
  async getByClass(classId: string) {
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.students.filter(s => s.class_id === classId);
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.students.filter(s => s.parent_id === parentId);
    }

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
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.students.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase()) ||
        s.roll_number.toLowerCase().includes(query.toLowerCase())
      );
    }

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