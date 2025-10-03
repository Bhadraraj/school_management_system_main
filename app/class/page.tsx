"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ClassModal from "@/components/class/ClassModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, GraduationCap, Edit, Trash2 } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

const classesData = [
  {
    id: "CLS001",
    name: "Grade 10A",
    teacher: "Dr. Sarah Wilson",
    students: 32,
    subject: "Mathematics",
    room: "Room 101",
    schedule: "Mon-Fri 9:00-10:00 AM",
    status: "Active",
  },
  {
    id: "CLS002",
    name: "Grade 10B",
    teacher: "Mr. John Davis",
    students: 28,
    subject: "Physics",
    room: "Room 102",
    schedule: "Mon-Fri 10:00-11:00 AM",
    status: "Active",
  },
  {
    id: "CLS003",
    name: "Grade 9A",
    teacher: "Ms. Emily Chen",
    students: 30,
    subject: "English",
    room: "Room 103",
    schedule: "Mon-Fri 11:00-12:00 PM",
    status: "Active",
  },
];

export default function ClassPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState(null);

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

  const handleDelete = (classItem: any) => {
    if (confirm("Are you sure you want to delete this class?")) {
      console.log("Delete class:", classItem);
    }
  };

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
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Add </span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classesData.map((classItem) => (
              <Card
                key={classItem.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {classItem.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {classItem.teacher}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {classItem.students} Students
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Subject:</span>{" "}
                      {classItem.subject}
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
      />
    </>
  );
}
