import { supabase } from '@/lib/supabase';
import { mockData, mockApiDelay } from './mock-data';
import { isSupabaseConfigured } from '@/lib/supabase';

export const dashboardApi = {
  // Get dashboard statistics
  async getStats() {
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return mockData.dashboardStats;
    }

    try {
      // Get counts for different entities
      const [
        studentsResult,
        teachersResult,
        parentsResult,
        feesResult,
        expensesResult,
        attendanceResult,
      ] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
        supabase.from('fees').select('amount, status'),
        supabase.from('expenses').select('amount'),
        supabase.from('attendance').select('status').gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      ]);

      // Calculate earnings from paid fees
      const paidFees = feesResult.data?.filter(fee => fee.status === 'paid') || [];
      const totalEarnings = paidFees.reduce((sum, fee) => sum + Number(fee.amount), 0);

      // Calculate total expenses
      const totalExpenses = expensesResult.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      // Calculate attendance rate
      const attendanceData = attendanceResult.data || [];
      const presentCount = attendanceData.filter(record => record.status === 'present').length;
      const attendanceRate = attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0;

      return {
        students: studentsResult.count || 0,
        teachers: teachersResult.count || 0,
        parents: parentsResult.count || 0,
        earnings: totalEarnings,
        expenses: totalExpenses,
        attendanceRate: Math.round(attendanceRate),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities() {
    if (!isSupabaseConfigured()) {
      await mockApiDelay();
      return {
        students: mockData.students.slice(0, 5),
        exams: [],
        notices: [],
        fees: mockData.fees.slice(0, 5),
      };
    }

    try {
      const [
        recentStudents,
        recentExams,
        recentNotices,
        recentFees,
      ] = await Promise.all([
        supabase
          .from('students')
          .select('id, name, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('exams')
          .select(`
            id, name, date,
            subjects:subject_id (name)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('notices')
          .select('id, title, date, priority')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('fees')
          .select(`
            id, amount, status, due_date,
            students:student_id (name)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      return {
        students: recentStudents.data || [],
        exams: recentExams.data || [],
        notices: recentNotices.data || [],
        fees: recentFees.data || [],
      };
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  // Get exam results chart data
  async getExamResultsChartData() {
    const { data, error } = await supabase
      .from('exam_results')
      .select(`
        grade,
        percentage,
        exams:exam_id (
          date,
          subjects:subject_id (
            name
          )
        )
      `)
      .order('exams(date)', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Process data for chart
    const chartData = data.reduce((acc, result) => {
      const subject = result.exams?.subjects?.name || 'Unknown';
      const existing = acc.find(item => item.subject === subject);
      
      if (existing) {
        existing.totalMarks += result.percentage;
        existing.count += 1;
        existing.average = existing.totalMarks / existing.count;
      } else {
        acc.push({
          subject,
          totalMarks: result.percentage,
          count: 1,
          average: result.percentage,
        });
      }
      
      return acc;
    }, [] as Array<{ subject: string; totalMarks: number; count: number; average: number }>);

    return chartData.map(item => ({
      subject: item.subject,
      average: Math.round(item.average),
    }));
  },

  // Get attendance chart data
  async getAttendanceChartData() {
    const { data, error } = await supabase
      .from('attendance')
      .select('date, status')
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date');

    if (error) throw error;

    // Group by date
    const chartData = data.reduce((acc, record) => {
      const date = record.date;
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        existing[record.status] += 1;
      } else {
        acc.push({
          date,
          present: record.status === 'present' ? 1 : 0,
          absent: record.status === 'absent' ? 1 : 0,
          late: record.status === 'late' ? 1 : 0,
        });
      }
      
      return acc;
    }, [] as Array<{ date: string; present: number; absent: number; late: number }>);

    return chartData;
  },
};