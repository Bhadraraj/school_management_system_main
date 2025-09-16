"use client";

import { useState, memo, useCallback, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import StudentModal from "@/components/students/StudentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

const studentsData = [
  {
    id: "STU001",
    name: "Alice Johnson",
    class: "Grade 10A",
    roll: "001",
    phone: "+1 234 567 8901",
    email: "alice.johnson@email.com",
    status: "Active",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "STU002",
    name: "Bob Smith",
    class: "Grade 10B",
    roll: "002",
    phone: "+1 234 567 8902",
    email: "bob.smith@email.com",
    status: "Active",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "STU003",
    name: "Carol Davis",
    class: "Grade 9A",
    roll: "003",
    phone: "+1 234 567 8903",
    email: "carol.davis@email.com",
    status: "Inactive",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const StudentsPage = memo(function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = useCallback(() => {
    setModalMode("create");
    setSelectedStudent(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((student: any) => {
    setModalMode("edit");
    setSelectedStudent(student);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((student: any) => {
    if (confirm("Are you sure you want to delete this student?")) {
      console.log("Delete student:", student);
    }
  }, []);

  return (
    <>
      <Layout allowedRoles={["admin", "teacher"]}>
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
          {/* Header Section */}
       

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
                    {studentsData.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={student.avatar}
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
                          {student.class}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {student.roll}
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
                              student.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {student.status}
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
                    {studentsData.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={student.avatar}
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
                                {student.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm">
                            <div className="text-muted-foreground">
                              {student.class}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Roll: {student.roll}
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
                              student.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {student.status}
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
                {studentsData.map((student) => (
                  <div
                    key={student.id}
                    className="bg-card text-card-foreground border rounded-xl p-4 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={student.avatar}
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
                            {student.id}
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
                          <p className="text-sm font-medium">{student.class}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Hash className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Roll</p>
                          <p className="text-sm font-medium">{student.roll}</p>
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
                          student.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          student.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                        }
                      >
                        {student.status}
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
      />
    </>
  );
});

export default StudentsPage;
