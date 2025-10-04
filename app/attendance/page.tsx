'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Layout from '@/components/layout/Layout';
import AttendanceGrid from '@/components/attendance/AttendanceGrid';

export default function AttendancePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'teacher') {
        router.replace('/attendance/teacher');
      } else if (user.role === 'admin') {
        router.replace('/attendance/admin');
      }
    }
  }, [user, router]);

  return (
    <Layout allowedRoles={['admin', 'teacher', 'parent']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-card-foreground mb-2">Attendance</h1>
          <p className="text-muted-foreground">View attendance records and statistics.</p>
        </div>

        <AttendanceGrid />
      </div>
    </Layout>
  );
}