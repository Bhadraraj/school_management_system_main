'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AttendanceGrid from '@/components/attendance/AttendanceGrid';
import AttendanceModal from '@/components/attendance/AttendanceModal';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function AttendancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Layout allowedRoles={['admin', 'teacher', 'parent']}>
      <div className="space-y-6">

          <AttendanceGrid onOpenModal={() => setIsModalOpen(true)} />
      </div>
    </Layout>

      <AttendanceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
      />
    </>
  );
}