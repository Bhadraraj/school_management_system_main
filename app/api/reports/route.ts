import { NextRequest, NextResponse } from 'next/server';
import { reportsApi } from '@/lib/api/reports';
import { analyticsApi } from '@/lib/api/analytics';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get('type');
    const studentId = searchParams.get('student_id');
    const classId = searchParams.get('class_id');
    const subjectId = searchParams.get('subject_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const format = searchParams.get('format') as 'csv' | 'pdf' || 'csv';

    switch (reportType) {
      case 'student_performance':
        if (!studentId) {
          return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
        }
        const studentReport = await reportsApi.getStudentPerformanceReport(studentId, startDate, endDate);
        return NextResponse.json(studentReport);

      case 'class_performance':
        if (!classId) {
          return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
        }
        const classReport = await reportsApi.getClassPerformanceReport(classId, subjectId);
        return NextResponse.json(classReport);

      case 'attendance':
        const attendanceReport = await reportsApi.getAttendanceReport(classId, studentId, startDate, endDate);
        return NextResponse.json(attendanceReport);

      case 'financial':
        const financialReport = await reportsApi.getFinancialReport(startDate, endDate);
        return NextResponse.json(financialReport);

      case 'export_students':
        const exportData = await reportsApi.exportStudentData(format);
        return NextResponse.json(exportData);

      case 'enrollment_trends':
        const months = parseInt(searchParams.get('months') || '12');
        const enrollmentTrends = await analyticsApi.getEnrollmentTrends(months);
        return NextResponse.json(enrollmentTrends);

      case 'grade_distribution':
        const gradeDistribution = await analyticsApi.getGradeDistribution(classId, subjectId);
        return NextResponse.json(gradeDistribution);

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}