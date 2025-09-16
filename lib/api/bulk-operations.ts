import { supabase } from '@/lib/supabase';
import { studentsApi, type StudentInsert } from './students';
import { teachersApi, type TeacherInsert } from './teachers';
import { feesApi, type FeeInsert } from './fees';

export const bulkOperationsApi = {
  // Bulk import students from CSV
  async importStudents(csvData: any[], schoolId: string) {
    try {
      const students: StudentInsert[] = csvData.map(row => ({
        name: row.name,
        email: row.email,
        phone: row.phone,
        class_id: row.class_id,
        roll_number: row.roll_number,
        date_of_birth: row.date_of_birth,
        address: row.address,
        admission_date: row.admission_date || new Date().toISOString().split('T')[0],
        school_id: schoolId,
      }));

      const results = [];
      const errors = [];

      for (const student of students) {
        try {
          const result = await studentsApi.create(student);
          results.push(result);
        } catch (error) {
          errors.push({ student: student.name, error: error.message });
        }
      }

      return {
        success: results.length,
        errors: errors.length,
        details: { results, errors },
      };
    } catch (error) {
      console.error('Error importing students:', error);
      throw error;
    }
  },

  // Bulk import teachers
  async importTeachers(csvData: any[], schoolId: string) {
    try {
      const results = [];
      const errors = [];

      for (const row of csvData) {
        try {
          // First create profile
          const { data: authData } = await supabase.auth.admin.createUser({
            email: row.email,
            password: 'temp123', // Temporary password
            email_confirm: true,
          });

          if (authData.user) {
            // Create profile
            await supabase.from('profiles').insert({
              id: authData.user.id,
              email: row.email,
              name: row.name,
              role: 'teacher',
              phone: row.phone,
              school_id: schoolId,
            });

            // Create teacher record
            const teacherData: TeacherInsert = {
              profile_id: authData.user.id,
              subject_id: row.subject_id,
              experience_years: parseInt(row.experience_years) || 0,
              qualification: row.qualification,
              join_date: row.join_date || new Date().toISOString().split('T')[0],
              school_id: schoolId,
            };

            const result = await teachersApi.create(teacherData);
            results.push(result);
          }
        } catch (error) {
          errors.push({ teacher: row.name, error: error.message });
        }
      }

      return {
        success: results.length,
        errors: errors.length,
        details: { results, errors },
      };
    } catch (error) {
      console.error('Error importing teachers:', error);
      throw error;
    }
  },

  // Bulk fee generation
  async generateBulkFees(
    studentIds: string[],
    feeType: string,
    amount: number,
    dueDate: string,
    schoolId: string
  ) {
    try {
      const fees: FeeInsert[] = studentIds.map(studentId => ({
        student_id: studentId,
        fee_type: feeType as any,
        amount,
        due_date: dueDate,
        status: 'unpaid',
        school_id: schoolId,
      }));

      const { data, error } = await supabase
        .from('fees')
        .insert(fees)
        .select();

      if (error) throw error;

      return {
        success: data.length,
        fees: data,
      };
    } catch (error) {
      console.error('Error generating bulk fees:', error);
      throw error;
    }
  },

  // Bulk attendance marking
  async markBulkAttendance(
    attendanceData: Array<{
      student_id: string;
      class_id: string;
      date: string;
      status: 'present' | 'absent' | 'late';
    }>,
    markedBy: string
  ) {
    try {
      const attendanceRecords = attendanceData.map(record => ({
        ...record,
        marked_by: markedBy,
      }));

      const { data, error } = await supabase
        .from('attendance')
        .upsert(attendanceRecords, {
          onConflict: 'student_id,date'
        })
        .select();

      if (error) throw error;

      return {
        success: data.length,
        records: data,
      };
    } catch (error) {
      console.error('Error marking bulk attendance:', error);
      throw error;
    }
  },

  // Bulk grade entry
  async enterBulkGrades(
    examId: string,
    grades: Array<{
      student_id: string;
      obtained_marks: number;
      grade: string;
      percentage: number;
    }>
  ) {
    try {
      const examResults = grades.map(grade => ({
        exam_id: examId,
        ...grade,
      }));

      const { data, error } = await supabase
        .from('exam_results')
        .upsert(examResults, {
          onConflict: 'exam_id,student_id'
        })
        .select();

      if (error) throw error;

      return {
        success: data.length,
        results: data,
      };
    } catch (error) {
      console.error('Error entering bulk grades:', error);
      throw error;
    }
  },

  // Bulk student promotion
  async promoteStudents(
    studentIds: string[],
    newClassId: string,
    academicYear: string
  ) {
    try {
      const { data, error } = await supabase
        .from('students')
        .update({
          class_id: newClassId,
          updated_at: new Date().toISOString(),
        })
        .in('id', studentIds)
        .select();

      if (error) throw error;

      // Log the promotion activity
      const auditLogs = studentIds.map(studentId => ({
        action: 'PROMOTE_STUDENT',
        table_name: 'students',
        record_id: studentId,
        new_values: { class_id: newClassId, academic_year: academicYear },
      }));

      await supabase.from('audit_logs').insert(auditLogs);

      return {
        success: data.length,
        promotedStudents: data,
      };
    } catch (error) {
      console.error('Error promoting students:', error);
      throw error;
    }
  },
};