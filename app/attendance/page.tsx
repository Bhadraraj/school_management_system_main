'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AttendanceGrid from '@/components/attendance/AttendanceGrid';
import AttendanceModal from '@/components/attendance/AttendanceModal';
import { attendanceApi } from '@/lib/api/attendance';
import { classesApi } from '@/lib/api/classes';
import { studentsApi } from '@/lib/api/students';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function AttendancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, studentsData] = await Promise.all([
          classesApi.getAll(),
          studentsApi.getAll(),
        ]);
        setClasses(classesData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Layout allowedRoles={['admin', 'teacher', 'parent']}>
      <div className="space-y-6">

          <AttendanceGrid 
            onOpenModal={() => setIsModalOpen(true)} 
            students={students}
            loading={loading}
          />
      </div>
    </Layout>

      <AttendanceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
        classes={classes}
        students={students}
      />
    </>
  );
}