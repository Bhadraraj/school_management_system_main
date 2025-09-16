"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  Minus,
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
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
const students = [
  "Michele Johnson",
  "Courtney Henry",
  "Jacob Jones",
  "Robert Fox",
  "Cody Fisher",
  "Arlene McCoy",
  "Jerome Bell",
  "Theresa Webb",
  "Dianne Russell",
  "Eleanor Pena",
];

const dates = Array.from({ length: 14 }, (_, i) => 15 + i);

// Mock attendance data - in real app this would come from API
const generateAttendanceData = () => {
  const data: {
    [key: string]: { [key: number]: "present" | "absent" | "holiday" };
  } = {};

  students.forEach((student) => {
    data[student] = {};
    dates.forEach((date) => {
      // Random attendance for demo
      if (date === 19 || date === 24) {
        data[student][date] = "holiday";
      } else {
        data[student][date] = Math.random() > 0.3 ? "present" : "absent";
      }
    });
  });

  return data;
};

const attendanceData = generateAttendanceData();

export default function AttendanceGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Library</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Attendance</BreadcrumbPage>
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 w-full sm:w-64"
              />
            </div>

            {/* Select Dropdown */}
            <Select defaultValue="2week" className="w-full sm:w-32">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">Last 1 week</SelectItem>
                <SelectItem value="2week">Last 2 weeks</SelectItem>
                <SelectItem value="1month">Last 1 month</SelectItem>
              </SelectContent>
            </Select>

            {/* Add Button */}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 min-w-40">
                    Students Name
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date}
                      className="text-center py-3 px-2 text-sm font-medium text-gray-600 min-w-12"
                    >
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {student}
                    </td>
                    {dates.map((date) => {
                      const status = attendanceData[student][date];
                      return (
                        <td key={date} className="py-4 px-2 text-center">
                          {status === "holiday" ? (
                            <div className="w-6 h-6 mx-auto flex items-center justify-center">
                              <Minus className="w-4 h-4 text-gray-400" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "w-6 h-6 mx-auto rounded-full flex items-center justify-center",
                                status === "present"
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              )}
                            >
                              {status === "present" ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
