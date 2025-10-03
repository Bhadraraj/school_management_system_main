"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const gradesData = [
  {
    id: "GRD001",
    studentName: "Alice Johnson",
    studentId: "STU001",
    subject: "Mathematics",
    examType: "Mid Term",
    totalMarks: 100,
    obtainedMarks: 95,
    grade: "A+",
    percentage: "95%",
    date: "2023-12-15",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "GRD002",
    studentName: "Bob Smith",
    studentId: "STU002",
    subject: "Physics",
    examType: "Final Term",
    totalMarks: 100,
    obtainedMarks: 88,
    grade: "A",
    percentage: "88%",
    date: "2023-12-14",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "GRD003",
    studentName: "Carol Davis",
    studentId: "STU003",
    subject: "Chemistry",
    examType: "Mid Term",
    totalMarks: 100,
    obtainedMarks: 92,
    grade: "A+",
    percentage: "92%",
    date: "2023-12-13",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "GRD004",
    studentName: "David Wilson",
    studentId: "STU004",
    subject: "English",
    examType: "Class Test",
    totalMarks: 50,
    obtainedMarks: 42,
    grade: "B+",
    percentage: "84%",
    date: "2023-12-12",
    avatar:
      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function ExamGradesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "A":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "B+":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "B":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-red-100 text-red-700 hover:bg-red-100";
    }
  };

  return (
    <Layout allowedRoles={["admin", "teacher", "parent"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Exam Grades
            </h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Exam</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Exam Grades</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Add </span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search grades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Student
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Subject
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Exam Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Marks
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Grade
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Percentage
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gradesData.map((grade) => (
                    <tr
                      key={grade.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={grade.avatar}
                              alt={grade.studentName}
                            />
                            <AvatarFallback>
                              {grade.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-gray-900">
                              {grade.studentName}
                            </span>
                            <p className="text-xs text-gray-500">
                              {grade.studentId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {grade.subject}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {grade.examType}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {grade.obtainedMarks}/{grade.totalMarks}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getGradeColor(grade.grade)}>
                          {grade.grade}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {grade.percentage}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(grade.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-gray-400" />
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
  );
}
