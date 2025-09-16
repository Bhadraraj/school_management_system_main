"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";

const studentDetails = [
  {
    id: "STU001",
    name: "Alice Johnson",
    class: "Grade 10A",
    roll: "001",
    phone: "+1 234 567 8901",
    email: "alice.johnson@email.com",
    address: "123 Main St, City, State 12345",
    dateOfBirth: "2008-05-15",
    parentName: "Robert Johnson",
    parentPhone: "+1 234 567 8900",
    admissionDate: "2023-01-15",
    status: "Active",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    grades: [
      { subject: "Mathematics", marks: "95/100", grade: "A+" },
      { subject: "Physics", marks: "88/100", grade: "A" },
      { subject: "Chemistry", marks: "92/100", grade: "A+" },
    ],
    attendance: "95%",
  },
];

export default function StudentDetailsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const student = studentDetails[0];

  return (
    <Layout allowedRoles={["admin", "teacher", "parent"]}>
      <div className="space-y-4 sm:space-y-6  ">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Student Details
            </h1>

            <div className="block sm:hidden">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/students" className="text-sm">
                      Students
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm">
                      Student Details
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="hidden sm:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/students">Students</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Student Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
          >
            <Edit className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>

        {/* Mobile Breadcrumb */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Student Profile Card */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Student Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="text-base sm:text-lg">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                    {student.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {student.class} • Roll #{student.roll}
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100 text-xs sm:text-sm">
                    {student.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600 break-all">
                    {student.phone}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600 break-all">
                    {student.email}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600 break-words">
                    {student.address}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">
                    DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">
                    Admission:{" "}
                    {new Date(student.admissionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Details Tabs */}
          <Card className="xl:col-span-2">
            <CardContent className="p-3 sm:p-6">
              <Tabs defaultValue="academic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
                  <TabsTrigger
                    value="academic"
                    className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                  >
                    Academic
                  </TabsTrigger>
                  <TabsTrigger
                    value="personal"
                    className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                  >
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="parent"
                    className="text-xs sm:text-sm px-2 sm:px-4 py-2"
                  >
                    Parent Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="academic" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">
                          Current Grades
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {student.grades.map((grade, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between flex-wrap gap-2"
                            >
                              <span className="text-sm sm:text-base text-gray-600 min-w-0 flex-1">
                                {grade.subject}
                              </span>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className="text-sm sm:text-base font-medium">
                                  {grade.marks}
                                </span>
                                <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                                  {grade.grade}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">
                          Attendance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-green-600">
                            {student.attendance}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Overall Attendance
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Full Name
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-words mt-1">
                        {student.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Date of Birth
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">
                        {new Date(student.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone Number
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-all mt-1">
                        {student.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email Address
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-all mt-1">
                        {student.email}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-words mt-1">
                        {student.address}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="parent" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Parent Name
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-words mt-1">
                        {student.parentName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Parent Phone
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-all mt-1">
                        {student.parentPhone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Relationship
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">
                        Father
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Emergency Contact
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-all mt-1">
                        {student.parentPhone}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
