"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ClassModal from "@/components/class/ClassModal";
import { classesApi } from "@/lib/api/classes";
import { teachersApi } from "@/lib/api/teachers";
import { subjectsApi } from "@/lib/api/subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, GraduationCap, Edit, Trash2 } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function ClassPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, teachersData, subjectsData] = await Promise.all([
          classesApi.getAll(),
          teachersApi.getAll(),
          subjectsApi.getAll(),
        ]);
        setClasses(classesData);
        setTeachers(teachersData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load classes data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEdit = (classItem: any) => {
    setModalMode("edit");
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (classItem: any) => {
    if (confirm(`Are you sure you want to delete ${classItem.name}?`)) {
      try {
        await classesApi.delete(classItem.id);
        setClasses(prev => prev.filter(c => c.id !== classItem.id));
        toast({
          title: "Success",
          description: "Class deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting class:', error);
        toast({
          title: "Error",
          description: "Failed to delete class",
          variant: "destructive",
        });
      }
    }
  };

  const handleClassSaved = async () => {
    try {
      const classesData = await classesApi.getAll();
      setClasses(classesData);
    } catch (error) {
      console.error('Error refreshing classes:', error);
    }
  };

  if (loading) {
    return (
      <Layout allowedRoles={["admin", "teacher"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <>
      <Layout allowedRoles={["admin", "teacher"]}>
        <div className="space-y-6">
         

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">Class</h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Class</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Add Class</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card
                key={classItem.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {classItem.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {classItem.teachers?.profiles?.name || 'No Teacher Assigned'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {classItem.students?.length || 0} Students
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Subject:</span>{" "}
                      {classItem.subjects?.name || 'No Subject'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Room:</span>{" "}
                      {classItem.room}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Schedule:</span>{" "}
                      {classItem.schedule}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-auto" // Adjust to content width
                      onClick={() => handleEdit(classItem)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline"> Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-auto" // Adjust to content width
                      onClick={() => handleDelete(classItem)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline"> Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>

      <ClassModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        classData={selectedClass}
        teachers={teachers}
        subjects={subjects}
        onSaved={handleClassSaved}
      />
    </>
  );
}
