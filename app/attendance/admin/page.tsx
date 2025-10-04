'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Layout from '@/components/layout/Layout';
import dynamic from 'next/dynamic';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaveRequest } from '@/components/attendance/LeaveManagementTable';

const TeacherAttendanceTable = dynamic(() => import('@/components/attendance/TeacherAttendanceTable'), { ssr: false });
const LeaveManagementTable = dynamic(() => import('@/components/attendance/LeaveManagementTable'), { ssr: false });
const AttendanceReports = dynamic(() => import('@/components/attendance/AttendanceReports'), { ssr: false });

const mockTeachers = [
  { id: '1', name: 'Dr. Sarah Wilson', subject: 'Mathematics', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', email: 'sarah.wilson@school.edu' },
  { id: '2', name: 'Mr. John Davis', subject: 'Physics', avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', email: 'john.davis@school.edu' },
  { id: '3', name: 'Ms. Emily Chen', subject: 'English', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', email: 'emily.chen@school.edu' },
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    teacherId: '1',
    teacherName: 'Dr. Sarah Wilson',
    teacherAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2025-10-10',
    endDate: '2025-10-12',
    leaveType: 'sick',
    reason: 'Medical checkup and recovery',
    status: 'pending',
    submittedDate: '2025-10-04'
  },
  {
    id: '2',
    teacherId: '2',
    teacherName: 'Mr. John Davis',
    teacherAvatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    startDate: '2025-10-08',
    endDate: '2025-10-08',
    leaveType: 'personal',
    reason: 'Family event',
    status: 'approved',
    submittedDate: '2025-10-01'
  }
];

const mockTeacherReports = [
  { className: 'Total Teachers', totalStudents: 45, present: 42, absent: 2, late: 1, percentage: 93 }
];

export default function AdminAttendancePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [view, setView] = useState<'attendance' | 'leave' | 'reports'>('attendance');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-5 h-5 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: 'approved' as 'approved' | 'pending' | 'rejected' } : req)
    );
  };

  const handleReject = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: 'rejected' as 'approved' | 'pending' | 'rejected' } : req)
    );
  };

  const handleExportCSV = () => {
    alert('Exporting to CSV...');
  };

  const handleExportPDF = () => {
    alert('Exporting to PDF...');
  };

  return (
    <Layout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-card-foreground mb-2">Teacher Attendance Management</h1>
            <p className="text-muted-foreground">
              Mark teacher attendance, manage leave requests, and view reports.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'attendance' ? 'default' : 'outline'}
              onClick={() => setView('attendance')}
            >
              Attendance
            </Button>
            <Button
              variant={view === 'leave' ? 'default' : 'outline'}
              onClick={() => setView('leave')}
            >
              Leave Requests
            </Button>
            <Button
              variant={view === 'reports' ? 'default' : 'outline'}
              onClick={() => setView('reports')}
            >
              Reports
            </Button>
          </div>
        </div>

        {view === 'attendance' && (
          <TeacherAttendanceTable
            teachers={mockTeachers}
            date={selectedDate}
            onAttendanceChange={(attendance) => console.log('Attendance:', attendance)}
          />
        )}

        {view === 'leave' && (
          <LeaveManagementTable
            leaveRequests={leaveRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {view === 'reports' && (
          <AttendanceReports
            reports={mockTeacherReports}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />
        )}
      </div>
    </Layout>
  );
}
