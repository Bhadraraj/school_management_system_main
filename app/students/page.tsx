"use client";

import { useState, memo, useCallback, useMemo, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import StudentModal from "@/components/students/StudentModal";
import { studentsApi, type Student } from "@/lib/api/students";
import { classesApi } from "@/lib/api/classes";
import { checkSubscriptionLimits } from "@/lib/utils/permissions";
import SubscriptionLimitWarning from "@/components/common/SubscriptionLimitWarning";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  Hash,
} from "lucide-react";

const StudentsPage = memo(function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [subscriptionLimits, setSubscriptionLimits] = useState<any>(null);

  // Fetch students and classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, classesData] = await Promise.all([
          studentsApi.getAll(),
          classesApi.getAll(),
        ]);
        setStudents(studentsData);
        setClasses(classesData);

        // Check subscription limits
        const limits = await checkSubscriptionLimits('school1-1111-1111-1111-111111111111', 'students');
        setSubscriptionLimits(limits);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load students data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);
  const handleCreate = useCallback(() => {
    // Check if can add more students
    if (subscriptionLimits && !subscriptionLimits.canAdd) {
      toast({
        title: "Subscription Limit Reached",
        description: "You've reached your student limit. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setModalMode("create");
    setSelectedStudent(null);
    setIsModalOpen(true);
  }, [subscriptionLimits, toast]);

  const handleEdit = useCallback((student: any) => {
    setModalMode("edit");
    setSelectedStudent(student);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (student: any) => {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        await studentsApi.delete(student.id);
        setStudents(prev => prev.filter(s => s.id !== student.id));
        toast({
          title: "Success",
          description: "Student deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting student:', error);
        toast({
          title: "Error",
          description: "Failed to delete student",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleStudentSaved = useCallback(async () => {
    try {
      const studentsData = await studentsApi.getAll();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error refreshing students:', error);
    }
  }, []);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    
    return students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.classes?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  if (loading) {
    return (
      <Layout allowedRoles={["admin", "teacher"]}>
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
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
      <Layout allowedRoles={["admin", "teacher"]}>
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
          {/* Header Section */}
          
          <SubscriptionLimitWarning 
            schoolId="school1-1111-1111-1111-111111111111"
            resource="students"
          />

          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl font-semibold">
                All Students
              </CardTitle>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-0 sm:px-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Class
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Roll
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={student.avatar_url}
                                alt={student.name}
                              />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground group-hover:text-accent-foreground">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {student.id}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {student.classes?.name || 'No Class'}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {student.roll_number}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground whitespace-nowrap">
                          {student.phone}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {student.email}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              student.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {student.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(student)}
                            >
                              <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student)}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet View */}
              <div className="hidden md:block lg:hidden overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Student
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Details
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Contact
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={student.avatar_url}
                                alt={student.name}
                              />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">
                                {student.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {student.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm">
                            <div className="text-muted-foreground">
                              {student.classes?.name || 'No Class'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Roll: {student.roll_number}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm">
                            <div className="text-muted-foreground break-all">
                              {student.phone}
                            </div>
                            <div className="text-xs text-muted-foreground break-all">
                              {student.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge
                            variant={
                              student.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {student.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(student)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 px-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-card text-card-foreground border rounded-xl p-4 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={student.avatar_url}
                            alt={student.name}
                          />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {student.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {student.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Class</p>
                          <p className="text-sm font-medium">{student.classes?.name || 'No Class'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Hash className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Roll</p>
                          <p className="text-sm font-medium">{student.roll_number}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium break-all">
                            {student.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium break-all">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-4 flex justify-end">
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "secondary"
                        }
                        className={
                          student.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                        }
                      >
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>

      <StudentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        student={selectedStudent}
        classes={classes}
        onSaved={handleStudentSaved}
      />
    </>
  );
});

export default StudentsPage;
