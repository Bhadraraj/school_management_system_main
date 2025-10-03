'use client';

import Layout from '@/components/layout/Layout';
import AttendanceGrid from '@/components/attendance/AttendanceGrid';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function AttendancePage() {
  return (
    <Layout allowedRoles={['admin', 'teacher', 'parent']}>
      <div className="space-y-6">
        

        <AttendanceGrid />
      </div>
    </Layout>
  );
}