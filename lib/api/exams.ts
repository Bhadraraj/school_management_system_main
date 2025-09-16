import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Exam = Database['public']['Tables']['exams']['Row'];
export type ExamInsert = Database['public']['Tables']['exams']['Insert'];
export type ExamUpdate = Database['public']['Tables']['exams']['Update'];

export type ExamResult = Database['public']['Tables']['exam_results']['Row'];
export type ExamResultInsert = Database['public']['Tables']['exam_results']['Insert'];
export type ExamResultUpdate = Database['public']['Tables']['exam_results']['Update'];

export const examsApi = {
  // Get all exams with related data
  async getAll() {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        subjects:subject_id (
          id,
          name,
          code
        ),
        classes:class_id (
          id,
          name
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get exam by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        subjects:subject_id (
          id,
          name,
          code
        ),
        classes:class_id (
          id,
          name
        ),
        exam_results:exam_results!exam_id (
          id,
          obtained_marks,
          grade,
          percentage,
          students:student_id (
            id,
            name,
            roll_number
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new exam
  async create(exam: ExamInsert) {
    const { data, error } = await supabase
      .from('exams')
      .insert(exam)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update exam
  async update(id: string, updates: ExamUpdate) {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete exam
  async delete(id: string) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get upcoming exams
  async getUpcoming(limit: number = 10) {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        subjects:subject_id (
          name
        ),
        classes:class_id (
          name
        )
      `)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date')
      .limit(limit);

    if (error) throw error;
    return data;
  },
};

export const examResultsApi = {
  // Get all exam results
  async getAll() {
    const { data, error } = await supabase
      .from('exam_results')
      .select(`
        *,
        exams:exam_id (
          id,
          name,
          exam_type,
          date,
          subjects:subject_id (
            name
          )
        ),
        students:student_id (
          id,
          name,
          roll_number,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get results by exam ID
  async getByExam(examId: string) {
    const { data, error } = await supabase
      .from('exam_results')
      .select(`
        *,
        students:student_id (
          id,
          name,
          roll_number,
          avatar_url
        )
      `)
      .eq('exam_id', examId)
      .order('percentage', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get results by student ID
  async getByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('exam_results')
      .select(`
        *,
        exams:exam_id (
          id,
          name,
          exam_type,
          date,
          total_marks,
          subjects:subject_id (
            name
          )
        )
      `)
      .eq('student_id', studentId)
      .order('exams(date)', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create exam result
  async create(result: ExamResultInsert) {
    const { data, error } = await supabase
      .from('exam_results')
      .insert(result)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update exam result
  async update(id: string, updates: ExamResultUpdate) {
    const { data, error } = await supabase
      .from('exam_results')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete exam result
  async delete(id: string) {
    const { error } = await supabase
      .from('exam_results')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Bulk create exam results
  async createBulk(results: ExamResultInsert[]) {
    const { data, error } = await supabase
      .from('exam_results')
      .insert(results)
      .select();

    if (error) throw error;
    return data;
  },
};