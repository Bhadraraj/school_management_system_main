'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Layout from '@/components/layout/Layout';
import dynamic from 'next/dynamic';

const MyClassesCard = dynamic(() => import('@/components/dashboard/teacher/MyClassesCard'), { ssr: false });
const TodayScheduleCard = dynamic(() => import('@/components/dashboard/teacher/TodayScheduleCard'), { ssr: false });
const AttendanceOverviewCard = dynamic(() => import('@/components/dashboard/teacher/AttendanceOverviewCard'), { ssr: false });
const AssignmentsCard = dynamic(() => import('@/components/dashboard/teacher/AssignmentsCard'), { ssr: false });
const ClassPerformanceChart = dynamic(() => import('@/components/dashboard/teacher/ClassPerformanceChart'), { ssr: false });
const AnnouncementsCard = dynamic(() => import('@/components/dashboard/teacher/AnnouncementsCard'), { ssr: false });
import { GraduationCap } from 'lucide-react';

export default function TeacherDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'teacher') {
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

  if (user.role !== 'teacher') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-5 h-5 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout allowedRoles={['teacher']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-card-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here's your overview for today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MyClassesCard />
          <AttendanceOverviewCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodayScheduleCard />
          </div>
          <AssignmentsCard />
        </div>

        <ClassPerformanceChart />

        <AnnouncementsCard />
      </div>
    </Layout>
  );
}
