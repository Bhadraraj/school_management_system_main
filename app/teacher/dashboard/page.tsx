'use client';

import { useState, memo, useCallback, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TeacherModal from '@/components/teachers/TeacherModal';
import { teachersApi } from '@/lib/api/teachers';
import { subjectsApi } from '@/lib/api/subjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

const TeachersPage = memo(function TeachersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersData, subjectsData] = await Promise.all([
          teachersApi.getAll(),
          subjectsApi.getAll(),
        ]);
        setTeachers(teachersData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load teachers data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreate = useCallback(() => {
    setModalMode('create');
    setSelectedTeacher(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((teacher: any) => {
    setModalMode('edit');
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (teacher: any) => {
    if (confirm(`Are you sure you want to delete ${teacher.profiles?.name}?`)) {
      try {
        await teachersApi.delete(teacher.id);
        setTeachers(prev => prev.filter(t => t.id !== teacher.id));
        toast({
          title: "Success",
          description: "Teacher deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast({
          title: "Error",
          description: "Failed to delete teacher",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleTeacherSaved = useCallback(async () => {
    try {
      const teachersData = await teachersApi.getAll();
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error refreshing teachers:', error);
    }
  }, []);

  if (loading) {
    return (
      <Layout allowedRoles={['admin']}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-64" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout allowedRoles={['teacher']}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Teacher Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Classes & Students</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search classes..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Class</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Students</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Schedule</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.slice(0, 3).map((teacher) => (
                      <tr key={teacher.id} className="border-b border-border hover:bg-accent transition-colors group">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-purple-600 font-medium">
                                {teacher.classes?.[0]?.name?.charAt(0) || 'C'}
                              </span>
                            </div>
                            <span className="font-medium text-foreground group-hover:text-accent-foreground whitespace-nowrap">
                              {teacher.classes?.[0]?.name || 'Demo Class'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {teacher.subjects?.name || 'Demo Subject'}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {teacher.classes?.length || 0} Students
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          Mon-Fri 9:00-10:00
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={teacher.status === 'active' ? 'default' : 'secondary'}
                            className={teacher.status === 'active' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                            }
                          >
                            {teacher.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
      
      <TeacherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        teacher={selectedTeacher}
        subjects={subjects}
        onSaved={handleTeacherSaved}
      />
    </>
  );
});

export default TeachersPage;