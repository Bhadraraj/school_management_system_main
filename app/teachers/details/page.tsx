"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";

const teacherDetails = [
  {
    id: "TEA001",
    name: "Dr. Sarah Wilson",
    subject: "Mathematics",
    classes: ["Grade 10A", "Grade 10B"],
    phone: "+1 234 567 8901",
    email: "sarah.wilson@school.edu",
    address: "456 Oak Street, City, State 12345",
    dateOfBirth: "1985-03-20",
    joinDate: "2020-08-15",
    experience: "8 years",
    qualification: "Ph.D. in Mathematics",
    status: "Active",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    students: 60,
    schedule: [
      {
        day: "Monday",
        time: "9:00-10:00 AM",
        class: "Grade 10A",
        subject: "Mathematics",
      },
      {
        day: "Tuesday",
        time: "10:00-11:00 AM",
        class: "Grade 10B",
        subject: "Mathematics",
      },
      {
        day: "Wednesday",
        time: "9:00-10:00 AM",
        class: "Grade 10A",
        subject: "Mathematics",
      },
    ],
  },
];

export default function TeacherDetailsPage() {
  const teacher = teacherDetails[0];

  return (
    <Layout allowedRoles={["admin"]}>
      <div className="space-y-6">
        {/* <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Teacher Details
            </h1>
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
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
          >
            <Edit className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div> */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Teacher Details
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
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
          >
            <Edit className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teacher Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Teacher Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback className="text-lg">
                    {teacher.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {teacher.name}
                  </h3>
                  <p className="text-gray-600">{teacher.subject} Teacher</p>
                  <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100">
                    {teacher.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{teacher.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{teacher.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{teacher.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Joined: {new Date(teacher.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{teacher.qualification}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Details Tabs */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="classes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacher.classes.map((className, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {className}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {teacher.subject}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              30 Students
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="space-y-3">
                    {teacher.schedule.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {schedule.class}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {schedule.subject}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {schedule.day}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {teacher.students}
                        </div>
                        <p className="text-sm text-gray-600">Total Students</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-green-600">
                          {teacher.experience}
                        </div>
                        <p className="text-sm text-gray-600">Experience</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {teacher.classes.length}
                        </div>
                        <p className="text-sm text-gray-600">Classes</p>
                      </CardContent>
                    </Card>
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
