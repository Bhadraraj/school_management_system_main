'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { dashboardApi } from '@/lib/api/dashboard';
import Layout from '@/components/layout/Layout';
import StatsCards from '@/components/dashboard/StatsCards';
import ExamResultsChart from '@/components/dashboard/ExamResultsChart';
import StudentsChart from '@/components/dashboard/StudentsChart';
import StarStudentsTable from '@/components/dashboard/StarStudentsTable';
import ExamResultsNotifications from '@/components/dashboard/ExamResultsNotifications';
import { GraduationCap } from 'lucide-react';

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, activities] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentActivities(),
        ]);
        setDashboardData({ stats, activities });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
    
    // Redirect to role-specific dashboard
    if (user.role === 'teacher') {
      router.replace('/teacher/dashboard');
      return;
    } else if (user.role === 'parent') {
      router.replace('/parent/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  return (
    <Layout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}! Here's what's happening at your school today.</p>
        </div>

        <StatsCards data={dashboardData?.stats} loading={loading} />

        <div className="flex flex-col lg:flex-row gap-6">
          <ExamResultsChart />
          <StudentsChart />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <StarStudentsTable />
          <ExamResultsNotifications />
        </div>
      </div>
    </Layout>
  );
}