"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import ExamScheduleModal from "./ExamScheduleModal";

interface ExamScheduleTableProps {
  onOpenModal?: () => void;
}

const examSchedules = [
  {
    examName: "Class Test",
    subject: "Chemistry",
    class: "A",
    date: "20/06/2023",
    time: "10 am-11 am",
    marks: "100%",
    selected: true,
  },
  {
    examName: "Class Test",
    subject: "Physics",
    class: "A",
    date: "20/06/2023",
    time: "10 am-11 am",
    marks: "100%",
  },
  {
    examName: "Class Test",
    subject: "Mathematics",
    class: "A",
    date: "20/06/2023",
    time: "10 am-11 am",
    marks: "100%",
  },
  {
    examName: "Class Test",
    subject: "English",
    class: "A",
    date: "20/06/2023",
    time: "10 am-11 am",
    marks: "100%",
    selected: true,
  },
];

export default function ExamScheduleTable({ onOpenModal }: ExamScheduleTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or roll"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <Checkbox />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Exam Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Class
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Date/Time
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Marks
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {examSchedules.map((exam, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <Checkbox checked={exam.selected} />
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {exam.examName}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{exam.subject}</td>
                    <td className="py-4 px-4 text-gray-600">{exam.class}</td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-gray-900 font-medium">
                          {exam.date}
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {exam.time}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{exam.marks}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === 3 ? "default" : "ghost"}
                  size="sm"
                  className={
                    page === 3 ? "bg-purple-600 hover:bg-purple-700" : ""
                  }
                >
                  {page}
                </Button>
              ))}
              <span className="text-gray-400">...</span>
              <Button variant="ghost" size="sm">
                100
              </Button>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Select defaultValue="10">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
