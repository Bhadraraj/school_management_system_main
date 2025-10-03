"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SubjectModal from "@/components/subject/SubjectModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const subjectsData = [
  {
    id: "SUB001",
    name: "Mathematics",
    teacher: "Dr. Sarah Wilson",
    classes: ["Grade 10A", "Grade 10B"],
    students: 60,
    code: "MATH101",
    credits: 4,
    status: "Active",
    icon: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "SUB002",
    name: "Physics",
    teacher: "Mr. John Davis",
    classes: ["Grade 11A", "Grade 12A"],
    students: 45,
    code: "PHY201",
    credits: 4,
    status: "Active",
    icon: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "SUB003",
    name: "English Literature",
    teacher: "Ms. Emily Chen",
    classes: ["Grade 9A", "Grade 9B"],
    students: 58,
    code: "ENG101",
    credits: 3,
    status: "Active",
    icon: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function SubjectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subject: any) => {
    setModalMode("edit");
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDelete = (subject: any) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      console.log("Delete subject:", subject);
    }
  };

  return (
    <>
      <Layout allowedRoles={["admin", "teacher"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">
                All Subjects
              </h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Subjects</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Add </span>
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4 sm:pb-6">
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search subjects..."
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Subject
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Code
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Teacher
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Classes
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Students
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Credits
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
                    {subjectsData.map((subject) => (
                      <tr
                        key={subject.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 rounded-lg">
                              <AvatarImage
                                src={subject.icon}
                                alt={subject.name}
                              />
                              <AvatarFallback className="rounded-lg">
                                <BookOpen className="w-5 h-5" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground group-hover:text-accent-foreground">
                              {subject.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground font-mono group-hover:text-accent-foreground">
                          {subject.code}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {subject.teacher}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {subject.classes.join(", ")}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {subject.students}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {subject.credits}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            {subject.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(subject)}
                            >
                              <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(subject)}
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
            </CardContent>
          </Card>
        </div>
      </Layout>

      <SubjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        subject={selectedSubject}
      />
    </>
  );
}
