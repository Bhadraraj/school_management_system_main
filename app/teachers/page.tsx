"use client";

import { useState, memo, useCallback, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import TeacherModal from "@/components/teachers/TeacherModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  Hash,
} from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

const teachersData = [
  {
    id: "TEA001",
    name: "Dr. Sarah Wilson",
    subject: "Mathematics",
    class: "Grade 10A, 10B",
    phone: "+1 234 567 8901",
    email: "sarah.wilson@school.edu",
    experience: "8 years",
    status: "Active",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "TEA002",
    name: "Mr. John Davis",
    subject: "Physics",
    class: "Grade 11A, 12A",
    phone: "+1 234 567 8902",
    email: "john.davis@school.edu",
    experience: "12 years",
    status: "Active",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "TEA003",
    name: "Ms. Emily Chen",
    subject: "English Literature",
    class: "Grade 9A, 9B",
    phone: "+1 234 567 8903",
    email: "emily.chen@school.edu",
    experience: "5 years",
    status: "On Leave",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const TeachersPage = memo(function TeachersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = useCallback(() => {
    setModalMode("create");
    setSelectedTeacher(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((teacher: any) => {
    setModalMode("edit");
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((teacher: any) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      console.log("Delete teacher:", teacher);
    }
  }, []);

  // Filtered teachers by search
  const filteredTeachers = useMemo(() => {
    return teachersData.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.class.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <>
      <Layout allowedRoles={["admin"]}>
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
         
 


<div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Teacher List
            </h1>
            <div className="hidden sm:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/teachers">Teachers</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Teacher Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <Button   onClick={handleCreate}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
          >
            <Plus className="w-3 h-3 sm:mr-1" />
           <span className="hidden sm:inline">Add</span>
          </Button>
        </div>

        
          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl font-semibold">
                All Teachers
              </CardTitle>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search teachers..."
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
                        Teacher
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Subject
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Classes
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Experience
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
                    {filteredTeachers.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={teacher.avatar}
                                alt={teacher.name}
                              />
                              <AvatarFallback>
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground group-hover:text-accent-foreground">
                              {teacher.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {teacher.id}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {teacher.subject}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {teacher.class}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground whitespace-nowrap">
                          {teacher.phone}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground whitespace-nowrap">
                          {teacher.experience}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              teacher.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              teacher.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {teacher.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(teacher)}
                            >
                              <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(teacher)}
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
                        Teacher
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
                    {filteredTeachers.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={teacher.avatar}
                                alt={teacher.name}
                              />
                              <AvatarFallback>
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">
                                {teacher.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {teacher.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm">
                            <div className="text-muted-foreground">
                              {teacher.subject}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {teacher.class}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm">
                            <div className="text-muted-foreground break-all">
                              {teacher.phone}
                            </div>
                            <div className="text-xs text-muted-foreground break-all">
                              {teacher.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge
                            variant={
                              teacher.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              teacher.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {teacher.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(teacher)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(teacher)}
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
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-card text-card-foreground border rounded-xl p-4 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={teacher.avatar}
                            alt={teacher.name}
                          />
                          <AvatarFallback>
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {teacher.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {teacher.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(teacher)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(teacher)}
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
                          <p className="text-xs text-muted-foreground">
                            Subject & Classes
                          </p>
                          <p className="text-sm font-medium">
                            {teacher.subject} ({teacher.class})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Hash className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            Experience
                          </p>
                          <p className="text-sm font-medium">
                            {teacher.experience}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium break-all">
                            {teacher.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium break-all">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-4 flex justify-end">
                      <Badge
                        variant={
                          teacher.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          teacher.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </div>
                  </div>
                ))}
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
      />
    </>
  );
});

export default TeachersPage;
