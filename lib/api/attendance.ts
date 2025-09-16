import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Attendance = Database['public']['Tables']['attendance']['Row'];
export type AttendanceInsert = Database['public']['Tables']['attendance']['Insert'];
export type AttendanceUpdate = Database['public']['Tables']['attendance']['Update'];

export const attendanceApi = {
  // Get attendance by date and class
  async getByDateAndClass(date: string, classId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        students:student_id (
          id,
          name,
          roll_number,
          avatar_url
        )
      `)
      .eq('date', date)
      .eq('class_id', classId)
      .order('students(roll_number)');

    if (error) throw error;
    return data;
  },

  // Get attendance for a student
  async getByStudent(studentId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        classes:class_id (
          name
        )
      `)
      .eq('student_id', studentId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mark attendance for multiple students
  async markAttendance(attendanceRecords: AttendanceInsert[]) {
    const { data, error } = await supabase
      .from('attendance')
      .upsert(attendanceRecords, {
        onConflict: 'student_id,date'
      })
      .select();

    if (error) throw error;
    return data;
  },

  // Update attendance record
  async update(id: string, updates: AttendanceUpdate) {
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete attendance record
  async delete(id: string) {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get attendance statistics
  async getStats(classId?: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('attendance')
      .select('status, student_id');

    if (classId) {
      query = query.eq('class_id', classId);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate statistics
    const total = data.length;
    const present = data.filter(record => record.status === 'present').length;
    const absent = data.filter(record => record.status === 'absent').length;
    const late = data.filter(record => record.status === 'late').length;

    return {
      total,
      present,
      absent,
      late,
      presentPercentage: total > 0 ? (present / total) * 100 : 0,
    };
  },
};