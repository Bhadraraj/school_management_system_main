import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Routine = Database['public']['Tables']['routines']['Row'];
export type RoutineInsert = Database['public']['Tables']['routines']['Insert'];
export type RoutineUpdate = Database['public']['Tables']['routines']['Update'];

export const routinesApi = {
  // Get all routines
  async getAll() {
    const { data, error } = await supabase
      .from('routines')
      .select(`
        *,
        classes:class_id (
          id,
          name
        ),
        subjects:subject_id (
          id,
          name
        ),
        teachers:teacher_id (
          id,
          profiles:profile_id (
            name
          )
        )
      `)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;
    return data;
  },

  // Get routine by class
  async getByClass(classId: string) {
    const { data, error } = await supabase
      .from('routines')
      .select(`
        *,
        subjects:subject_id (
          id,
          name
        ),
        teachers:teacher_id (
          id,
          profiles:profile_id (
            name
          )
        )
      `)
      .eq('class_id', classId)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;
    return data;
  },

  // Get routine by teacher
  async getByTeacher(teacherId: string) {
    const { data, error } = await supabase
      .from('routines')
      .select(`
        *,
        classes:class_id (
          id,
          name
        ),
        subjects:subject_id (
          id,
          name
        )
      `)
      .eq('teacher_id', teacherId)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;
    return data;
  },

  // Create new routine
  async create(routine: RoutineInsert) {
    const { data, error } = await supabase
      .from('routines')
      .insert(routine)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update routine
  async update(id: string, updates: RoutineUpdate) {
    const { data, error } = await supabase
      .from('routines')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete routine
  async delete(id: string) {
    const { error } = await supabase
      .from('routines')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get weekly schedule for a class
  async getWeeklySchedule(classId: string) {
    const { data, error } = await supabase
      .from('routines')
      .select(`
        *,
        subjects:subject_id (
          name
        ),
        teachers:teacher_id (
          profiles:profile_id (
            name
          )
        )
      `)
      .eq('class_id', classId)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;

    // Group by day of week
    const schedule = data.reduce((acc, routine) => {
      const day = routine.day_of_week;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(routine);
      return acc;
    }, {} as Record<number, typeof data>);

    return schedule;
  },

  // Check for schedule conflicts
  async checkConflicts(
    teacherId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: string
  ) {
    let query = supabase
      .from('routines')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('day_of_week', dayOfWeek)
      .or(`start_time.lte.${startTime}.and.end_time.gt.${startTime},start_time.lt.${endTime}.and.end_time.gte.${endTime}`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.length > 0;
  },
};