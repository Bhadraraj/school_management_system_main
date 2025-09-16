import { supabase } from '@/lib/supabase';

export const analyticsApi = {
  // Get enrollment trends
  async getEnrollmentTrends(months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data, error } = await supabase
      .from('students')
      .select('admission_date, status')
      .gte('admission_date', startDate.toISOString().split('T')[0])
      .order('admission_date');

    if (error) throw error;

    // Group by month
    const trends = data.reduce((acc, student) => {
      const month = student.admission_date.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(trends).map(([month, count]) => ({
      month,
      enrollments: count,
    }));
  },

  // Get attendance analytics
  async getAttendanceAnalytics(classId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from('attendance')
      .select('date, status, class_id')
      .gte('date', startDate.toISOString().split('T')[0]);

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate daily attendance rates
    const dailyStats = data.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = { total: 0, present: 0, absent: 0, late: 0 };
      }
      acc[date].total += 1;
      acc[date][record.status] += 1;
      return acc;
    }, {} as Record<string, { total: number; present: number; absent: number; late: number }>);

    return Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      attendanceRate: (stats.present / stats.total) * 100,
      ...stats,
    }));
  },

  // Get grade distribution
  async getGradeDistribution(classId?: string, subjectId?: string) {
    let query = supabase
      .from('exam_results')
      .select(`
        grade,
        percentage,
        exams:exam_id (
          class_id,
          subject_id
        )
      `);

    if (classId) {
      query = query.eq('exams.class_id', classId);
    }
    if (subjectId) {
      query = query.eq('exams.subject_id', subjectId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const gradeDistribution = data.reduce((acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const percentageRanges = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      'Below 60': 0,
    };

    data.forEach(result => {
      const percentage = result.percentage;
      if (percentage >= 90) percentageRanges['90-100']++;
      else if (percentage >= 80) percentageRanges['80-89']++;
      else if (percentage >= 70) percentageRanges['70-79']++;
      else if (percentage >= 60) percentageRanges['60-69']++;
      else percentageRanges['Below 60']++;
    });

    return {
      gradeDistribution,
      percentageRanges,
      totalResults: data.length,
      averagePercentage: data.length > 0 
        ? data.reduce((sum, result) => sum + result.percentage, 0) / data.length 
        : 0,
    };
  },

  // Get fee collection analytics
  async getFeeCollectionAnalytics(months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data, error } = await supabase
      .from('fees')
      .select('amount, status, fee_type, due_date, paid_date')
      .gte('due_date', startDate.toISOString().split('T')[0]);

    if (error) throw error;

    // Monthly collection trends
    const monthlyCollection = data.reduce((acc, fee) => {
      if (fee.status === 'paid' && fee.paid_date) {
        const month = fee.paid_date.substring(0, 7);
        acc[month] = (acc[month] || 0) + Number(fee.amount);
      }
      return acc;
    }, {} as Record<string, number>);

    // Fee type breakdown
    const feeTypeBreakdown = data.reduce((acc, fee) => {
      acc[fee.fee_type] = (acc[fee.fee_type] || 0) + Number(fee.amount);
      return acc;
    }, {} as Record<string, number>);

    // Collection rate
    const totalFees = data.reduce((sum, fee) => sum + Number(fee.amount), 0);
    const collectedFees = data.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + Number(fee.amount), 0);
    const collectionRate = totalFees > 0 ? (collectedFees / totalFees) * 100 : 0;

    return {
      monthlyCollection: Object.entries(monthlyCollection).map(([month, amount]) => ({
        month,
        amount,
      })),
      feeTypeBreakdown,
      summary: {
        totalFees,
        collectedFees,
        pendingFees: totalFees - collectedFees,
        collectionRate,
      },
    };
  },

  // Get teacher performance analytics
  async getTeacherPerformanceAnalytics(teacherId?: string) {
    let query = supabase
      .from('teachers')
      .select(`
        *,
        profiles:profile_id (
          name
        ),
        subjects:subject_id (
          name
        ),
        classes:classes!teacher_id (
          id,
          name,
          students:students!class_id (
            id,
            exam_results:exam_results!student_id (
              percentage,
              exams:exam_id (
                subject_id
              )
            )
          )
        )
      `);

    if (teacherId) {
      query = query.eq('id', teacherId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(teacher => {
      const classes = teacher.classes || [];
      const totalStudents = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0);
      
      // Calculate average performance of teacher's students
      const allResults = classes.flatMap(cls => 
        cls.students?.flatMap(student => 
          student.exam_results?.filter(result => 
            result.exams?.subject_id === teacher.subject_id
          ) || []
        ) || []
      );

      const averagePerformance = allResults.length > 0
        ? allResults.reduce((sum, result) => sum + result.percentage, 0) / allResults.length
        : 0;

      return {
        ...teacher,
        analytics: {
          totalClasses: classes.length,
          totalStudents,
          averagePerformance: Math.round(averagePerformance * 100) / 100,
          totalExams: allResults.length,
        },
      };
    });
  },
};