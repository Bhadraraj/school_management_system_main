import { supabase } from '@/lib/supabase';

export const reportsApi = {
  // Student performance report
  async getStudentPerformanceReport(studentId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('exam_results')
      .select(`
        *,
        exams:exam_id (
          name,
          exam_type,
          date,
          total_marks,
          subjects:subject_id (
            name
          )
        )
      `)
      .eq('student_id', studentId);

    if (startDate) query = query.gte('exams.date', startDate);
    if (endDate) query = query.lte('exams.date', endDate);

    const { data, error } = await query.order('exams(date)', { ascending: false });

    if (error) throw error;

    // Calculate statistics
    const totalExams = data.length;
    const averagePercentage = totalExams > 0 
      ? data.reduce((sum, result) => sum + result.percentage, 0) / totalExams 
      : 0;

    const gradeDistribution = data.reduce((acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      results: data,
      statistics: {
        totalExams,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        gradeDistribution,
      },
    };
  },

  // Class performance report
  async getClassPerformanceReport(classId: string, subjectId?: string) {
    let query = supabase
      .from('exam_results')
      .select(`
        *,
        students:student_id (
          name,
          roll_number,
          class_id
        ),
        exams:exam_id (
          name,
          exam_type,
          date,
          total_marks,
          class_id,
          subjects:subject_id (
            name
          )
        )
      `)
      .eq('exams.class_id', classId);

    if (subjectId) {
      query = query.eq('exams.subject_id', subjectId);
    }

    const { data, error } = await query.order('percentage', { ascending: false });

    if (error) throw error;

    // Calculate class statistics
    const totalStudents = new Set(data.map(result => result.student_id)).size;
    const averagePercentage = data.length > 0 
      ? data.reduce((sum, result) => sum + result.percentage, 0) / data.length 
      : 0;

    const topPerformers = data.slice(0, 5);
    const needsAttention = data.filter(result => result.percentage < 60);

    return {
      results: data,
      statistics: {
        totalStudents,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        topPerformers,
        needsAttention,
      },
    };
  },

  // Attendance report
  async getAttendanceReport(classId?: string, studentId?: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        students:student_id (
          name,
          roll_number,
          class_id,
          classes:class_id (
            name
          )
        )
      `);

    if (classId) query = query.eq('class_id', classId);
    if (studentId) query = query.eq('student_id', studentId);
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    // Calculate attendance statistics
    const totalDays = data.length;
    const presentDays = data.filter(record => record.status === 'present').length;
    const absentDays = data.filter(record => record.status === 'absent').length;
    const lateDays = data.filter(record => record.status === 'late').length;

    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      records: data,
      statistics: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      },
    };
  },

  // Financial report
  async getFinancialReport(startDate?: string, endDate?: string) {
    let feesQuery = supabase.from('fees').select('amount, status, fee_type, paid_date');
    let expensesQuery = supabase.from('expenses').select('amount, category, date');

    if (startDate) {
      feesQuery = feesQuery.gte('due_date', startDate);
      expensesQuery = expensesQuery.gte('date', startDate);
    }
    if (endDate) {
      feesQuery = feesQuery.lte('due_date', endDate);
      expensesQuery = expensesQuery.lte('date', endDate);
    }

    const [feesResult, expensesResult] = await Promise.all([
      feesQuery,
      expensesQuery,
    ]);

    if (feesResult.error) throw feesResult.error;
    if (expensesResult.error) throw expensesResult.error;

    const fees = feesResult.data;
    const expenses = expensesResult.data;

    // Calculate financial statistics
    const totalFees = fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
    const paidFees = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + Number(fee.amount), 0);
    const pendingFees = fees.filter(fee => fee.status === 'unpaid').reduce((sum, fee) => sum + Number(fee.amount), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    const netIncome = paidFees - totalExpenses;

    // Fee type breakdown
    const feeTypeBreakdown = fees.reduce((acc, fee) => {
      acc[fee.fee_type] = (acc[fee.fee_type] || 0) + Number(fee.amount);
      return acc;
    }, {} as Record<string, number>);

    // Expense category breakdown
    const expenseCategoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: {
        totalFees,
        paidFees,
        pendingFees,
        totalExpenses,
        netIncome,
        collectionRate: totalFees > 0 ? (paidFees / totalFees) * 100 : 0,
      },
      breakdown: {
        feeTypes: feeTypeBreakdown,
        expenseCategories: expenseCategoryBreakdown,
      },
    };
  },

  // Teacher workload report
  async getTeacherWorkloadReport(teacherId?: string) {
    let query = supabase
      .from('teachers')
      .select(`
        *,
        profiles:profile_id (
          name,
          email
        ),
        subjects:subject_id (
          name
        ),
        classes:classes!teacher_id (
          id,
          name,
          capacity,
          students:students!class_id (
            id
          )
        ),
        routines:routines!teacher_id (
          id,
          day_of_week,
          start_time,
          end_time
        )
      `);

    if (teacherId) {
      query = query.eq('id', teacherId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(teacher => {
      const totalClasses = teacher.classes?.length || 0;
      const totalStudents = teacher.classes?.reduce((sum, cls) => sum + (cls.students?.length || 0), 0) || 0;
      const weeklyHours = teacher.routines?.length || 0;

      return {
        ...teacher,
        workload: {
          totalClasses,
          totalStudents,
          weeklyHours,
          averageClassSize: totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0,
        },
      };
    });
  },

  // Export data for reports
  async exportStudentData(format: 'csv' | 'pdf' = 'csv') {
    const { data, error } = await supabase
      .from('students')
      .select(`
        name,
        email,
        phone,
        roll_number,
        date_of_birth,
        admission_date,
        status,
        classes:class_id (
          name
        ),
        profiles:parent_id (
          name,
          phone
        )
      `)
      .order('name');

    if (error) throw error;

    if (format === 'csv') {
      const csvHeaders = [
        'Name',
        'Email',
        'Phone',
        'Roll Number',
        'Date of Birth',
        'Class',
        'Parent Name',
        'Parent Phone',
        'Status',
        'Admission Date',
      ];

      const csvData = data.map(student => [
        student.name,
        student.email,
        student.phone,
        student.roll_number,
        student.date_of_birth,
        student.classes?.name || '',
        student.profiles?.name || '',
        student.profiles?.phone || '',
        student.status,
        student.admission_date,
      ]);

      return {
        headers: csvHeaders,
        data: csvData,
      };
    }

    return data;
  },
};