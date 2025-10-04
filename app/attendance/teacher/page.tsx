'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Layout from '@/components/layout/Layout';
import dynamic from 'next/dynamic';
import { GraduationCap } from 'lucide-react';

const ClassTimer = dynamic(() => import('@/components/attendance/ClassTimer'), { ssr: false });
const StudentAttendanceList = dynamic(() => import('@/components/attendance/StudentAttendanceList'), { ssr: false });
const AttendanceReports = dynamic(() => import('@/components/attendance/AttendanceReports'), { ssr: false });

const mockStudents = [
  { id: '1', name: 'Alice Johnson', rollNo: '001', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '2', name: 'Bob Smith', rollNo: '002', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '3', name: 'Charlie Brown', rollNo: '003', avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '4', name: 'Diana Prince', rollNo: '004', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '5', name: 'Edward Norton', rollNo: '005', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const mockReports = [
  { className: 'Grade 10-A', totalStudents: 35, present: 32, absent: 2, late: 1, percentage: 91 },
  { className: 'Grade 10-B', totalStudents: 32, present: 30, absent: 1, late: 1, percentage: 94 },
];

export default function TeacherAttendancePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'teacher' && user.role !== 'admin') {
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

  const handleSessionEnd = () => {
    setIsLocked(true);
  };

  const handleAttendanceChange = (attendance: any) => {
    setAttendanceData(attendance);
  };

  const handleExportCSV = () => {
    alert('Exporting to CSV...');
  };

  const handleExportPDF = () => {
    alert('Exporting to PDF...');
  };

  const classSession = {
    startTime: '09:00',
    endTime: '09:45',
    className: 'Grade 10-A',
    subject: 'Mathematics'
  };

  return (
    <Layout allowedRoles={['teacher', 'admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-card-foreground mb-2">Student Attendance</h1>
          <p className="text-muted-foreground">
            Mark student attendance for your classes. Attendance can only be marked during class sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ClassTimer
              classSession={classSession}
              onSessionEnd={handleSessionEnd}
            />
          </div>

          <div className="lg:col-span-2">
            <StudentAttendanceList
              students={mockStudents}
              isLocked={isLocked}
              onAttendanceChange={handleAttendanceChange}
            />
          </div>
        </div>

        <AttendanceReports
          reports={mockReports}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
      </div>
    </Layout>
  );
}
